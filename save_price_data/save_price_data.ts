import { fetchPrices } from "./fetch_prices";
import { Schema, model } from "mongoose";
import { PriceDataI } from "./price_data_interface";
import mongoose from "mongoose";

export const priceDataSchema = new Schema<PriceDataI>({
	timestamp: { type: Number, required: true },
	readableTime: { type: String, required: true },
	open: { type: Number, required: true },
	close: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
});

//indexes documents using the timestamp in descending order so that the sorting is more efficient
priceDataSchema.index({ timestamp: -1 });

export async function connectToDb() {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/btcusdt");
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("Could not connect to MongoDB", err);
	}
}

export const PriceData = model<PriceDataI>("PriceData", priceDataSchema);

async function mostRecentPriceData(): Promise<number> {
	try {
		const doc = await PriceData.findOne().sort({ timestamp: -1 }).exec();
		if (doc) {
			console.log(doc.timestamp);
			console.log("Most recent date:", new Date(doc.timestamp));
			return doc.timestamp;
		} else {
			console.log("No documents found.");
			return new Date("2022-01-01").getTime();
		}
	} catch (err) {
		console.error(err);
		throw err;
	}
}

async function save_price_data() {
	await connectToDb();

	let currentTime = Date.now();
	let endTime = currentTime - (currentTime % (60000 * 5)) - 60000 * 5; // Calculate the last 5-minute mark. -6000*5 subtracts another five minutes to make sure that the last candle i fetch has closed (if it is still open then it means that i will get a price that might change until the candle closes)
	let startTime = (await mostRecentPriceData()) + 60000 * 5; //+ 60000*5 so that i dont fetch the same data as the ones already in the database

	while (startTime <= endTime) {
		const fetchedPrices = await fetchPrices(startTime, endTime);
		for (let i = 0; i < fetchedPrices.length; i++) {
			const priceData = new PriceData(fetchedPrices[i]);
			console.log(priceData);
			await priceData.save();
		}
		startTime = (await mostRecentPriceData()) + 60000 * 5;
		currentTime = Date.now();
		endTime = currentTime - (currentTime % (60000 * 5)) - 60000 * 5;
		//recalculating endTime because if the data are way too many, this process could take more than  5 minutes.
	}
	mongoose.connection.close();
}
save_price_data();

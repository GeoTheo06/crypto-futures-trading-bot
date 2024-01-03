import mongoose from "mongoose";
import { Schema, model } from "mongoose";

interface IBinanceData {
	timestamp: number;
	readableTime: string;
	open: number;
	close: number;
	high: number;
	low: number;
	indicators: {
		ema: number[];
		rsi: number[];
	};
}

const binanceSchema = new Schema<IBinanceData>({
	timestamp: { type: Number, required: true },
	readableTime: { type: String, required: true },
	open: { type: Number, required: true },
	close: { type: Number, required: true },
	high: { type: Number, required: true },
	low: { type: Number, required: true },
	indicators: {
		ema: { type: [Number], default: [] },
		rsi: { type: [Number], default: [] },
	},
});

const BinanceData = model<IBinanceData>("BinanceData", binanceSchema);

async function saveBinanceData(data: IBinanceData) {
	const binanceData = new BinanceData(data);

	try {
		await binanceData.save();
		console.log("Data saved:", binanceData);
	} catch (err) {
		console.error("Error saving data:", err);
	}
}

async function main() {
	try {
		await mongoose.connect("mongodb://127.0.0.1:27017/btcusdt");
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("Could not connect to MongoDB", err);
	}
	await saveBinanceData({
		timestamp: 100,
		readableTime: "bla",
		open: 12,
		close: 3,
		high: 49,
		low: 40,
		indicators: {
			ema: [50, 50, 40],
			rsi: [3, 43, 34, 345],
		},
	});
	mongoose.connection.close();
}

// Main function
main();

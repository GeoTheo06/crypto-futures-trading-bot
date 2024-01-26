import * as dotenv from "dotenv";
dotenv.config();

import { ema } from "./indicators/calculate_indicators";
import { save_price_data } from "./save_price_data/save_price_data";
import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { PriceDataI } from "./price_data_interface";
import { saveRealtimePrices } from "./save_price_data/save_price_data";
//connect to binance api
const Binance = require("node-binance-api");

const binance = new Binance().options({
	APIKEY: process.env.API_KEY!,
	APISECRET: process.env.API_SECRET!,
	useServerTime: true,
	test: false, // For testnet
});

//connect to Database

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

try {
	mongoose.connect("mongodb://127.0.0.1:27017/btcusdt");
	console.log("Connected to MongoDB");
} catch (err) {
	console.error("Could not connect to MongoDB", err);
}

export const PriceData = model<PriceDataI>("PriceData", priceDataSchema);

console.log("just checking how many times this is printed");

const sleep = (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

async function realtimeData() {
	let currentTime = Date.now();
	let timeTill5MinuteMark = 60000 * 5 - (currentTime % (60000 * 5)); // gives me the time that is left until the time reaches a 5 minute mark. so far in the code i have been calculating the time that has elapsed since the last 5 minute mark.
	console.log("started waiting", Date.now());
	await sleep(timeTill5MinuteMark + 10000); //needs 10 sec delay because binance needs some time to give actual close price.
	console.log("finished waiting", Date.now());
	saveRealtimePrices();
}

async function mainStrategy() {
	// await save_price_data();
	console.log("FINISHED FETCHING AND SAVING HISTORICAL DATA");

	await ema();
	// while (true) {
	// 	console.log("fetching realtime data");
	// 	// await realtimeData();
	// 	console.log("finished fetching realtime data");
	// }
}

mainStrategy();

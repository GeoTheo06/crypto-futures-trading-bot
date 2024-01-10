import * as dotenv from "dotenv";
dotenv.config();

import { calcEma } from "./indicators/calculate_indicators";
import { save_price_data } from "./save_price_data/save_price_data";
import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { PriceDataI } from "./price_data_interface";

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

save_price_data();
calcEma();

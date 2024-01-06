import * as dotenv from "dotenv";
dotenv.config();
import { saveHistoricalPrices } from "./save_price_data/historical_prices";
import { saveRealtimePrices } from "./save_price_data/realtime_prices";
import { calcEma } from "./indicators/calculate_indicators";
const Binance = require("node-binance-api");

// Assuming Binance and EMA have appropriate TypeScript definitions
const binance = new Binance().options({
	APIKEY: process.env.API_KEY!,
	APISECRET: process.env.API_SECRET!,
	useServerTime: true,
	test: false, // For testnet
});

saveHistoricalPrices();
saveRealtimePrices();
calcEma();
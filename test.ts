import * as dotenv from "dotenv";
dotenv.config();

const Binance = require("node-binance-api");
import { EMA } from "technicalindicators";
import * as fs from "fs";

// Assuming Binance and EMA have appropriate TypeScript definitions
const binance = new Binance().options({
	APIKEY: process.env.API_KEY!,
	APISECRET: process.env.API_SECRET!,
	useServerTime: true,
	test: false, // For testnet
});

interface Candle {
	time: string;
	open: number;
	high: number;
	low: number;
	close: number;
	ema: number;
}

function writeToFile(data: Candle[]): void {
	const filePath = "indicator_values.txt";
	fs.writeFile(filePath, JSON.stringify(data, null, 2), (err: NodeJS.ErrnoException | null) => {
		if (err) throw err;
		console.log(`Saved indicator values to ${filePath}`);
	});
}

async function calculateEMA200WithDetails(): Promise<void> {
	try {
		const candles = await binance.futuresCandles("BTCUSDT", "5m", { limit: 1000 });
		const closingPrices: number[] = candles.map((candle: any) => parseFloat(candle[4]));
		const ema200: number[] = EMA.calculate({ period: 200, values: closingPrices });

		const detailedData: Candle[] = candles.slice(200 - ema200.length).map((candle: any, index: number) => ({
			time: new Date(candle[0]).toLocaleString("en-US", { timeZone: "Europe/Athens" }),
			open: parseFloat(candle[1]),
			high: parseFloat(candle[2]),
			low: parseFloat(candle[3]),
			close: parseFloat(candle[4]),
			ema: ema200[index],
		}));

		writeToFile(detailedData);
	} catch (error: any) {
		console.error("Error:", error);
	}
}

calculateEMA200WithDetails();

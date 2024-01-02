import axios from "axios";
import fs from "fs";
import path from "path";
import { start } from "repl";

interface MarketData {
	openTime: number;
	open: string;
	high: string;
	low: string;
	close: string;
	readableTime: string;
}

const jsonFilePath = path.join(__dirname, "marketData.json");

// read the last date from the JSON file
const getLastDate = (): number => {
	if (fs.existsSync(jsonFilePath)) {
		const data: MarketData[] = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
		return data[data.length - 1].openTime;
	} else {
		return new Date("2023-12-20").getTime(); // Default start time
	}
};

const fetchMarketData = async (startTime: number, endTime: number): Promise<MarketData[]> => {
	try {
		const response = await axios.get("https://fapi.binance.com/fapi/v1/markPriceKlines", {
			params: {
				symbol: "BTCUSDT",
				interval: "5m",
				startTime,
				endTime,
				limit: 1000,
			},
		});

		const newMarketData: MarketData[] = response.data.map((kline: (string | number)[]) => {
			const [openTime, open, high, low, close] = kline;
			// console.log("openTime: ", openTime, " open: ", open, " low: ", low, " close: ", close);

			return {
				openTime: openTime as number,
				open: open as string,
				high: high as string,
				low: low as string,
				readableTime: new Date(openTime as number).toLocaleString(),
			};
		});

		return newMarketData;
	} catch (error) {
		console.error("Error fetching market data:", error);
		return [];
	}
};

let startTime = getLastDate();
const currentTime = Date.now();
const endTime = currentTime - (currentTime % (60000 * 5)); // 60000 is how many milliseconds there are in one minute. so with the calculation currentTime mod (60000*5) i get how much time has passed since the nearest 5-minute mark. subtracting this time by the current time, gives me the last 5-minute mark.

const updateMarketData = async () => {
	fs.appendFileSync(jsonFilePath, "[");

	while (startTime < endTime) {
		console.log(startTime, endTime);

		const marketData = await fetchMarketData(startTime, endTime);

		for (let i = 0; i < marketData.length; i++) {
			if (marketData[marketData.length - 1].openTime == endTime && i == marketData.length - 1) {
				fs.appendFileSync(jsonFilePath, JSON.stringify(marketData[i]) + "\n");
			} else {
				fs.appendFileSync(jsonFilePath, JSON.stringify(marketData[i]) + ",\n");
			}
			console.log("i: ", i, "market ", marketData.length);
		}
		startTime = marketData[marketData.length - 1].openTime + 1;
	}
	fs.appendFileSync(jsonFilePath, "]");
};

updateMarketData();

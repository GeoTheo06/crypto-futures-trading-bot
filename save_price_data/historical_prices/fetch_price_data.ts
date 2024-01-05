import axios from "axios";
import { PriceDataFields } from "../price_data_interface";
import fs from "fs";
export async function fetchPriceData(startTime: number, endTime: number): Promise<PriceDataFields[]> {
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

		console.log("success fetching data: ", response.data);
		console.log(response.data);
		
		return response.data;
	} catch (error) {
		console.error("Error fetching market data:", error);
		return [];
	}
}

// const getLastDate = (): number => {
// 	if (fs.existsSync(jsonFilePath)) {
// 		const data: MarketData[] = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
// 		return data[data.length - 1].openTime;
// 	} else {
// 		return new Date("2023-12-20").getTime(); // Default start time
// 	}
// };
let startTime = new Date("2023-12-20").getTime();
const currentTime = Date.now();
const endTime = currentTime - (currentTime % (60000 * 5)); // 60000 is how many milliseconds there are in one minute. so with the calculation currentTime mod (60000*5) i get how much time has passed since the nearest 5-minute mark. subtracting this time by the current time, gives me the last 5-minute mark.


fetchPriceData(startTime, endTime);
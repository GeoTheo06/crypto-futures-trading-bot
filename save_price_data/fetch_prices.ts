import axios from "axios";
import { PriceDataI } from "../price_data_interface";

export async function fetchPrices(startTime: number, endTime: number): Promise<PriceDataI[]> {
	try {
		const response = await axios.get("https://fapi.binance.com/fapi/v1/markPriceKlines", {
			params: {
				symbol: "BTCUSDT",
				interval: "5m",
				startTime,
				endTime,
				limit: 1500,
			},
		});

		const priceData = response.data.map(
			(object: any[]): PriceDataI => ({
				timestamp: object[0],
				readableTime: new Date(object[0]).toLocaleString(),
				open: object[1],
				close: object[4],
				high: object[2],
				low: object[3],
			})
		);
			console.log("close time in fetchd: ", response.data[0][6], "open time in fetchd: ", response.data[0][0]);
		console.log("success fetching data: ", priceData[0]);
		return priceData;
	} catch (error) {
		console.error("Error fetching market data:", error);
		return [];
	}
}

import axios from "axios";
import { PriceDataFields } from "./price_data_interface";

export async function fetchHistoricalData(startTime: number, endTime: number): Promise<PriceDataFields[]> {
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

		console.log("success fetching data: ", response.data);
		console.log(response.data);

		return response.data;
	} catch (error) {
		console.error("Error fetching market data:", error);
		return [];
	}
}

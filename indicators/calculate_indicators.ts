import { EMA } from "technicalindicators";
import { PriceData } from "../main";

export async function ema() {
	console.log("calculating ema");
	const records = await PriceData.find().sort({ timestamp: -1 }).limit(200).select("close -_id");
	EMA.calculate({ period: 200, values: records});

}
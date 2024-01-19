import { fetchPrices } from "./fetch_prices";
import { PriceData } from "../main";

async function mostRecentPriceDataOnDb(): Promise<number> {
	try {
		const doc = await PriceData.findOne().sort({ timestamp: -1 }).exec();
		if (doc) {
			console.log(doc.timestamp);
			console.log("Most recent date:", new Date(doc.timestamp));
			return doc.timestamp;
		} else {
			console.log("No documents found.");
			return new Date("2022-01-01").getTime();
		}
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export async function saveRealtimePrices() {
	let currentTime = Date.now();
	let startTime = currentTime - (currentTime % (60000 * 5)) - 60000 * 5;
	let endTime = currentTime - (currentTime % (60000 * 5)) - 1;
	console.log("hey1");
	console.log("starttime: ", startTime, "endtime: ", endTime);
	const fetchedPrices = await fetchPrices(startTime, endTime);
	const priceData = new PriceData(fetchedPrices[0]); //its only one object but the fetchPrices returns array, so i have to [0]
	await priceData.save();
}

export async function save_price_data() {
	//historical prices
	let startTime = (await mostRecentPriceDataOnDb()) + 60000 * 5; //+ 60000*5 so that i dont fetch the same data as the ones already in the database
	let currentTime = Date.now();
	let endTime = currentTime - (currentTime % (60000 * 5)) - 1; // Calculate the last 5-minute mark. -1 subtracts another millisecond to make sure that i am in the 5 minute mark that has closed and not the current that hasn't closed yet
	console.log("starttime: ", startTime, "endtime: ", endTime);
	while (startTime < endTime) {
		const fetchedPrices = await fetchPrices(startTime, endTime);
		for (let i = 0; i < fetchedPrices.length; i++) {
			const priceData = new PriceData(fetchedPrices[i]);
			await priceData.save();
		}
		startTime = (await mostRecentPriceDataOnDb()) + 60000 * 5;
		currentTime = Date.now();
		endTime = currentTime - (currentTime % (60000 * 5)) - 1;
		//recalculating endTime because if the data are way too many, this process could take more than  5 minutes.
	}
	console.log("fetched historical prices");
}

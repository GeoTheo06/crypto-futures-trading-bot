//will update price from the last  date in the log.
import fs from "fs"
import {parse} from "csv-parse/sync"
const csvFilePath = "log_price_data/price_data/BTCUSDT-5m-ALL-DATA.csv";

export function saveRealtimePrices() {
	// Read and parse the CSV file
	const csvData = fs.readFileSync(csvFilePath, "utf8");
	const parsedData = parse(csvData, {
		columns: true,
	});
	// Get the last row in the parsed data
	const lastRow = parsedData[parsedData.length - 1];
	console.log(lastRow);
	
}
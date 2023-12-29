import fs from "fs";
import moment from "moment";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const directoryPath = "price_data";
var firstMonth = true;
//getting how many years of data we have (currently 2023 only)
fs.readdirSync(directoryPath).forEach((file) => {
	// Read the CSV file
	const input = fs.readFileSync(`${directoryPath}/${file}`, "utf8");

	// Define a type for the record structure in the CSV file
	interface Record {
		open_time: string;
		close_time: string;
		[key: string]: string;
	}

	// Parse the CSV file
	let records: Record[] = parse(input, {
		columns: true,
		skip_empty_lines: true,
	});

	// Convert epoch to readable format (they are in milliseconds)
	records.forEach((record) => {
		record.open_time_readable = moment(parseInt(record.open_time)).format("MM/DD/YYYY, hh:mm:ss A");
		record.close_time_readable = moment(parseInt(record.close_time)).format("MM/DD/YYYY, hh:mm:ss A");
	});

	// Convert back to CSV
	let output = stringify(records, {
		header: true,
	});

	if (!firstMonth) {
		const lines = output.split("\n");

		// Remove the first (header) line
		lines.shift();

		// Join the remaining lines back into a single string
		output = lines.join("\n");
	}

	fs.appendFileSync("BTCUSDT-5m-ALL-DATA.csv", output);
	firstMonth = false;
});
console.log("File conversion complete.");

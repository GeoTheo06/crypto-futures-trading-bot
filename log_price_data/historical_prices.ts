import fs from "fs";
import moment from "moment";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const directoryPath = "log_price_data/price_data";
var firstMonth = true;
fs.unlinkSync("log_price_data/price_data/BTCUSDT-5m-ALL-DATA.csv"); //DELETE AFTER TESTING
export function saveHistoricalPrices() {

	// Loop through each file in the directory
	fs.readdirSync(directoryPath).forEach((file) => {
		const input = fs.readFileSync(`${directoryPath}/${file}`, "utf8");

		interface Record {
			open_time?: string;
			close_time?: string;
			volume?: string;
			quote_volume?: string;
			count?: string;
			taker_buy_volume?: string;
			taker_buy_quote_volume?: string;
			ignore?: string;
			[key: string]: string | undefined;
		}

		let records: Record[] = parse(input, {
			columns: true,
			skip_empty_lines: true,
		});

		records = records.map((record) => {
			if (record.open_time && record.close_time) {
				// Convert epoch to readable format if open_time and close_time are defined
				record.open_time_readable = moment(parseInt(record.open_time)).format("MM/DD/YYYY-hh:mm:ss A");
				record.close_time_readable = moment(parseInt(record.close_time)).format("MM/DD/YYYY-hh:mm:ss A");
			}

			// Remove the unecessary fields
			delete record.open_time;
			delete record.close_time;
			delete record.volume;
			delete record.quote_volume;
			delete record.count;
			delete record.taker_buy_volume;
			delete record.taker_buy_quote_volume;
			delete record.ignore;
			return record;
		});
		//because of the "header: firstMonth" only the header of the first file will be printed in the (beginning of the) final file
		let output = stringify(records, {
			header: firstMonth,
		});
		firstMonth = false;

		fs.appendFileSync("log_price_data/price_data/BTCUSDT-5m-ALL-DATA.csv", output);
	});

	console.log("File conversion complete.");
}
import fs from "fs";
import moment from "moment";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const directoryPath = "log_price_data/price_data";
const outputFile = "BTCUSDT-5m-ALL-DATA.csv";

interface BinanceTypeMarketData {
	open: number;
	high: number;
	low: number;
	close: number;
	open_time: string;
}

interface MarketData {
	open: number;
	high: number;
	low: number;
	close: number;
	time: string;
}

// DELETE THIS LINE AFTER TESTING
try {
	fs.unlinkSync("log_price_data/price_data/BTCUSDT-5m-ALL-DATA.csv");
} catch (error) {
	console.log(`${directoryPath}/${outputFile} doesn't exist`);
}

export function saveHistoricalPrices() {
	let allMarketData: MarketData[] = [];

	//iterate over each file
	fs.readdirSync(directoryPath).forEach((file) => {
		const input = fs.readFileSync(`${directoryPath}/${file}`, "utf8");

		let monthlyMarketData: BinanceTypeMarketData[] = parse(input, {
			columns: true,
			skip_empty_lines: true,
		});

		monthlyMarketData.forEach((row) => {
			let processedRow: MarketData = {
				open: row.open,
				high: row.high,
				low: row.low,
				close: row.close,
				time: moment(parseInt(row.open_time)).format("YYYY/MM/DDThh:mm:ss A"),
			};
			allMarketData.push(processedRow);
		});
	});

	const csvOutput = stringify(allMarketData, {
		header: true,
	});

	fs.writeFileSync("log_price_data/price_data/BTCUSDT-5m-ALL-DATA.csv", csvOutput);

	console.log("File conversion complete.");
}
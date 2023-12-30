import { EMA } from 'technicalindicators';
import * as fs from 'fs';
import {parse} from "csv-parse/sync"

export function calcEma() {
// Function to read CSV and extract closing prices
const readCSV = (filePath: string): number[] => {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const records = parse(fileContent, { columns: true });
    return records.map((record: any) => parseFloat(record.close));
};

const filePath = 'log_price_data/price_data/BTCUSDT-5m-ALL-DATA.csv';
const closingPrices = readCSV(filePath);

const test = EMA.calculate({period: 200, values: closingPrices });
fs.writeFileSync("fg", test.toString());
}
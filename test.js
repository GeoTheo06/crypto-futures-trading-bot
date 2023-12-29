require("dotenv").config();
const Binance = require("node-binance-api");
const { EMA } = require("technicalindicators");

const binance = new Binance().options({
	APIKEY: process.env.API_KEY,
	APISECRET: process.env.API_SECRET,
	useServerTime: true,
	test: false, // For testnet
});

const fs = require("fs");

function writeToFile(data) {
	const filePath = "indicator_values.txt";
	fs.writeFile(filePath, JSON.stringify(data, null, 2), function (err) {
		if (err) throw err;
		console.log(`Saved indicator values to ${filePath}`);
	});
}

async function calculateEMA200WithDetails() {
	try {
		const candles = await binance.futuresCandles("BTCUSDT", "5m", { limit: 1000 });
		const closingPrices = candles.map((candle) => parseFloat(candle[4]));
		const ema200 = EMA.calculate({ period: 200, values: closingPrices });

		const detailedData = candles.slice(200 - ema200.length).map((candle, index) => ({
			time: new Date(candle[0]).toLocaleString("en-US", { timeZone: "Europe/Athens" }),
			open: parseFloat(candle[1]),
			high: parseFloat(candle[2]),
			low: parseFloat(candle[3]),
			close: parseFloat(candle[4]),
			ema: ema200[index],
		}));

		writeToFile(detailedData);
	} catch (error) {
		console.error("Error:", error);
	}
}

calculateEMA200WithDetails();

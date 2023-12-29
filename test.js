require("dotenv").config();
const Binance = require("node-binance-api");
const { EMA } = require("technicalindicators");

const binance = new Binance().options({
	APIKEY: process.env.API_KEY,
	APISECRET: process.env.API_SECRET,
	useServerTime: true,
	test: false, // For testnet
});
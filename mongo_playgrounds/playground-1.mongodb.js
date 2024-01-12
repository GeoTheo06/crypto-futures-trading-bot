/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use("btcusdt");
//find last 10 docs
// db.pricedatas.find().sort({ timestamp: -1 }).limit(50000);

//delete last 10
// const last10Entries = db.pricedatas.find({}).sort({ timestamp: -1 }).limit(10);
// // Delete these entries
// last10Entries.forEach((doc) => {
// 	db.pricedatas.deleteOne({ _id: doc._id });
// });

//find docs with the same timestamp (works)
// db.pricedatas.aggregate([
// 	{
// 		$group: {
// 			_id: "$timestamp",
// 			count: { $sum: 1 },
// 			documents: { $push: "$$ROOT" },
// 		},
// 	},
// 	{
// 		$match: {
// 			count: { $gt: 1 },
// 		},
// 	},
// ]);

//checking if each document's timestamp is its previous document's timestamp incremented by 5 mins
//NOTE:
//this shows the documents that are not incremented by 5 minutes.
//it will show the first doc and also another at 1699587300000 unix time because of error in binance api. nothing i can do to fix. data from 5:35 to 6:05 are missing.

// db.pricedatas.aggregate([
// 	// Sort documents by timestamp in ascending order
// 	{ $sort: { timestamp: 1 } },

// 	// Use $group with a window function to get the previous timestamp
// 	{
// 		$setWindowFields: {
// 			sortBy: { timestamp: 1 },
// 			output: {
// 				previousTimestamp: {
// 					$shift: {
// 						output: "$timestamp",
// 						by: -1,
// 						default: null, // Adjust as needed
// 					},
// 				},
// 			},
// 		},
// 	},

// 	// Calculate the time difference in milliseconds
// 	{
// 		$project: {
// 			timestamp: 1,
// 			previousTimestamp: 1,
// 			timeDifference: {
// 				$subtract: ["$timestamp", "$previousTimestamp"],
// 			},
// 		},
// 	},

// 	// Filter to find documents where the difference is not 5 minutes (300000 milliseconds)
// 	{
// 		$match: {
// 			timeDifference: { $ne: 300000 },
// 		},
// 	},
// ]);

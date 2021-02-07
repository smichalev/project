const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema({
	name: String,
	created: {
		type: Date,
		default: Date.now,
	},
});

const City = mongoose.model("City", userScheme);

module.exports = City;

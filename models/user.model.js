const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema({
	login: String,
	password: String,
	role: String,
	city: mongoose.Types.ObjectId,
	created: {
		type: Date,
		default: Date.now,
	},
});

const User = mongoose.model("User", userScheme);

module.exports = User;

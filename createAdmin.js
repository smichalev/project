const path = require('path');
const md5 = require('md5');
const mongoose = require('mongoose');
const {User} = require(path.join(__dirname, 'models'));

(async () => {
	await mongoose.connect('mongodb://localhost:27017/database', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	
	let user = await User.findOne({login: 'admin'});
	
	if (!user) {
		const newUser = new User({login: 'admin', password: md5('admin'), role: 'admin'});
		
		await newUser.save();
		
		console.log('Создали');
	}
	else {
		console.log('Пользователь уже был!');
	}
	
})();

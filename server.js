const path = require('path');
const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const store = new MemoryStore({
	checkPeriod: 86400000,
});

const MODE = process.env.NODE_ENV || 'development';

(async () => {
	try {
		await mongoose.connect('mongodb://localhost:27017/database', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		
		app.listen(5000, () => {
			console.log('Go to http://127.0.0.1:' + 5000);
		});
	}
	catch (e) {
		console.log(e);
	}
})();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(MODE === 'production' ? '/project' : '/', express.static('assets'));
app.use(session({
	resave: true,
	saveUninitialized: true,
	store,
	cookie: {maxAge: 86400000},
	secret: '123',
}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('./routes')(app);

const path = require('path');
const md5 = require('md5');
const ErrorList = require(path.join(__dirname, '..', 'errors', 'error.list'));
const {User, City} = require(path.join(__dirname, '..', 'models'));
const getFolderCity = require(path.join(__dirname, '..', 'lib', 'getFolderCity'));
const axios = require('axios');
const MODE = process.env.NODE_ENV || 'development';

async function getCity(id) {
	let result = await City.findById(id);
	
	return result.name;
}

module.exports = (app) => {
	app.get(MODE === 'production' ? '/project' : '/', async (req, res, next) => {
		try {
			if (!req.session.user) {
				return res.redirect(MODE === 'production' ? '/project/login' : '/login');
			}
			
			let params = {
				user: req.session.user,
				role: req.session.user.role,
			};
			
			if (req.session.user.role === 'admin') {
				params.city = await City.find({});
				
				let usersList = await User.find({});
				
				let users = [];
				
				for (let i = 0; i < usersList.length; i++) {
					if (usersList[i].role !== 'admin') {
						let city = (await getCity(usersList[i].city));
						
						users.push({
							_id: usersList[i]._id,
							login: usersList[i].login,
							password: usersList[i].password,
							role: usersList[i].role,
							city: usersList[i].city,
							cityName: city,
							created: usersList[i].created,
							__v: usersList[i].__v,
						});
					}
				}
				
				params.users = users;
				params.mode = MODE;
			}
			else {
				params.mode = MODE;
				params.city = (await getCity(req.session.user.city));
				
				params.document = (await getFolderCity(params.city));
			}
			
			res.render('index', params);
		}
		catch (e) {
			next(e);
		}
	});
	app.get(MODE === 'production' ? '/project/login' : '/login', (req, res, next) => {
		try {
			if (req.session.user) {
				return res.redirect(MODE === 'production' ? '/project' : '/');
			}
			
			res.render('login', {
				mode: MODE,
			});
		}
		catch (e) {
			next(e);
		}
	});
	app.post(MODE === 'production' ? '/project/login' : '/login', async (req, res, next) => {
		try {
			if (!req.body.login) {
				throw new ErrorList(ErrorList.CODES.LOGIN_REQUIRED);
			}
			
			if (!req.body.password) {
				throw new ErrorList(ErrorList.CODES.PASSWORD_REQUIRED);
			}
			
			let user = await User.findOne({login: req.body.login, password: md5(req.body.password)});
			
			if (!user) {
				throw new ErrorList(ErrorList.CODES.BAD_PASSWORD_OR_LOGIN);
			}
			
			req.session.user = user;
			req.session.save();
			
			res.json({
				result: 'ok',
			});
		}
		catch (e) {
			next(e);
		}
	});
	app.post(MODE === 'production' ? '/project/logout' : '/logout', (req, res, next) => {
		try {
			req.session.destroy();
			
			res.json({
				result: 'ok',
			});
		}
		catch (err) {
			next(err);
		}
	});
	app.post(MODE === 'production' ? '/project/delete-city' : '/delete-city', async (req, res, next) => {
		try {
			if (!req.session.user || req.session.user.role !== 'admin') {
				throw new ErrorList(ErrorList.CODES.NO_RIGHTS_TO_ACT);
			}
			
			if (!req.body._id) {
				throw new ErrorList(ErrorList.CODES.NOT_CORRECT_QUERY);
			}
			
			let findCity = await City.findById(req.body._id);
			
			if (!findCity) {
				throw new ErrorList(ErrorList.CODES.NOT_FOUND);
			}
			
			let findUser = await User.find({
				city: findCity._id,
			});
			
			if (findUser.length > 0) {
				throw new ErrorList(ErrorList.CODES.CANT_DELETE_CITY);
			}
			
			await City.findOneAndRemove({_id: req.body._id});
			
			res.json({
				result: findCity._id,
			});
		}
		catch (e) {
			next(e);
		}
	});
	app.post(MODE === 'production' ? '/project/new-city' : '/new-city', async (req, res, next) => {
		try {
			if (!req.session.user || req.session.user.role !== 'admin') {
				throw new ErrorList(ErrorList.CODES.NO_RIGHTS_TO_ACT);
			}
			
			if (!req.body.city) {
				throw new ErrorList(ErrorList.CODES.CITY_REQUIRED);
			}
			
			let findCity = await City.findOne({
				name: req.body.city,
			});
			
			if (findCity) {
				throw new ErrorList(ErrorList.CODES.CITY_IS_ALREADY_THERE);
			}
			
			const newCity = new City({name: req.body.city});
			await newCity.save();
			
			res.json({
				result: newCity,
			});
		}
		catch (err) {
			next(err);
		}
	});
	app.post(MODE === 'production' ? '/project/new-user' : '/new-user', async (req, res, next) => {
		try {
			if (!req.session.user || req.session.user.role !== 'admin') {
				throw new ErrorList(ErrorList.CODES.NO_RIGHTS_TO_ACT);
			}
			
			if (!req.body.login) {
				throw new ErrorList(ErrorList.CODES.LOGIN_REQUIRED);
			}
			
			if (!req.body.password) {
				throw new ErrorList(ErrorList.CODES.PASSWORD_REQUIRED);
			}
			
			if (!req.body.city) {
				throw new ErrorList(ErrorList.CODES.CITY_REQUIRED);
			}
			
			let cityes = [];
			
			(await City.find({})).forEach((item) => {
				cityes.push('' + item._id);
			});
			
			if (!~cityes.indexOf(req.body.city)) {
				throw new ErrorList(ErrorList.CODES.BAD_CITY);
			}
			
			let findUser = await User.findOne({
				login: req.body.login,
			});
			
			if (findUser) {
				throw new ErrorList(ErrorList.CODES.USER_IS_ALREADY_THERE);
			}
			
			const newUser = new User({login: req.body.login, password: md5(req.body.password), role: 'user', city: req.body.city});
			await newUser.save();
			
			res.json({
				result: newUser,
			});
		}
		catch (e) {
			next(e);
		}
	});
	app.post(MODE === 'production' ? '/project/delete-user' : '/delete-user', async (req, res, next) => {
		try {
			if (!req.session.user || req.session.user.role !== 'admin') {
				throw new ErrorList(ErrorList.CODES.NO_RIGHTS_TO_ACT);
			}
			
			if (!req.body._id) {
				throw new ErrorList(ErrorList.CODES.NOT_CORRECT_QUERY);
			}
			
			let findUser = await User.findById(req.body._id);
			
			if (!findUser) {
				throw new ErrorList(ErrorList.CODES.NOT_FOUND);
			}
			
			await User.findOneAndRemove({_id: req.body._id});
			
			res.json({
				result: findUser,
			});
		}
		catch (e) {
			next(e);
		}
	});
	
	app.get(MODE === 'production' ? '/project/document' : '/document', async (req, res, next) => {
		try {
			res.redirect(MODE === 'production' ? '/project' : '/');
		}
		catch (e) {
			next(e);
		}
	});
	
	app.get(MODE === 'production' ? '/project/download-document/:id' : '/download-document/:id', async (req, res, next) => {
		try {
			if (!req.session.user || req.session.user.role !== 'user') {
				throw new ErrorList(ErrorList.CODES.NO_RIGHTS_TO_ACT);
			}
			
			if (!req.params.id) {
				throw new ErrorList(ErrorList.CODES.NOT_CORRECT_QUERY);
			}
			
			let result = await axios.post('https://atcgaz.bitrix24.ru/rest/10028/eko8226nd4no73ff/disk.file.getexternallink.json?id=' + req.params.id);
			
			console.log(result.data.result);
			
			if (!result || !result.data || !result.data.result) {
				throw new ErrorList(ErrorList.CODES.NOT_FOUND);
			}
			
			res.redirect(result.data.result);
		}
		catch (e) {
			next(e);
		}
	});
	
	app.get(MODE === 'production' ? '/project/document/:id' : '/document/:id', async (req, res, next) => {
		try {
			if (!req.session.user || req.session.user.role !== 'user') {
				throw new ErrorList(ErrorList.CODES.NO_RIGHTS_TO_ACT);
			}
			
			if (!req.params.id) {
				throw new ErrorList(ErrorList.CODES.NOT_CORRECT_QUERY);
			}
			
			let result;
			
			try {
				result = await axios.post('https://atcgaz.bitrix24.ru/rest/10028/v3ywifvkfhtwi2jn/disk.folder.getchildren.json?id=' + req.params.id);
			}
			catch (e) {
				next(e);
			}
			
			if (!result || !result.data || !result.data.result || result.data.result.length === 0) {
				throw new ErrorList(ErrorList.CODES.NOT_FOUND);
			}
			
			let city = await getCity(req.session.user.city);
			
			let params = {
				document: result.data.result,
				mode: MODE,
				user: req.session.user,
				role: req.session.user.role,
				city,
			};
			
			res.render('document', params);
		}
		catch (e) {
			next(e);
		}
	});
	
	app.use((err, req, res, next) => {
		if (!err) {
			return next();
		}
		
		res.status(err.status).json({
			result: 'error',
			code: err.code,
			message: err.message,
		});
	});
	app.use((req, res) => {
		return res.render('error', {
			error: {message: 'Ничего не найдено', code: 404}, path: MODE === 'production' ? '/project' : '/',
			mode: MODE,
		});
	});
};

const CODES = {
	UNKNOWN_ERROR: 0,
	NOT_FOUND: 1,
	NOT_CORRECT_QUERY: 2,
	USER_IS_ALREADY_THERE: 3,
	BAD_PASSWORD_OR_LOGIN: 4,
	NO_RIGHTS_TO_ACT: 5,
	PAGE_NOT_FOUND: 6,
	CITY_IS_ALREADY_THERE: 7,
	LOGIN_REQUIRED: 8,
	PASSWORD_REQUIRED: 9,
	CITY_REQUIRED: 10,
	CANT_DELETE_CITY: 11,
	BAD_CITY: 12,
};
const messages = {
	[CODES.UNKNOWN_ERROR]: {
		status: 500,
		message: `Неизвестная ошибка`,
	},
	[CODES.NOT_FOUND]: {
		status: 404,
		message: `Ничего не найдено`,
	},
	[CODES.NOT_CORRECT_QUERY]: {
		status: 400,
		message: `Некорректный запрос`,
	},
	[CODES.USER_IS_ALREADY_THERE]: {
		status: 400,
		message: `Такой пользователь уже зарегистрирован`,
	},
	[CODES.CITY_IS_ALREADY_THERE]: {
		status: 400,
		message: `Такой город уже есть в системе`,
	},
	[CODES.BAD_PASSWORD_OR_LOGIN]: {
		status: 400,
		message: `Проверьте корректность логина или пароля`,
	},
	[CODES.NO_RIGHTS_TO_ACT]: {
		status: 400,
		message: `У вас нет прав для этого действия`,
	},
	[CODES.PAGE_NOT_FOUND]: {
		status: 404,
		message: `Страница не найдена`,
	},
	[CODES.LOGIN_REQUIRED]: {
		status: 400,
		message: `Поле логин является обязательным`,
	},
	[CODES.PASSWORD_REQUIRED]: {
		status: 400,
		message: `Поле пароль является обязательным`,
	},
	[CODES.CITY_REQUIRED]: {
		status: 400,
		message: `Поле город является обязательным`,
	},
	[CODES.CANT_DELETE_CITY]: {
		status: 400,
		message: `Невозможно удалить город так как у этого города есть пользователи`,
	},
	[CODES.BAD_CITY]: {
		status: 400,
		message: `Такого города нет в списке`,
	},
};

class ErrorList extends Error {
	constructor(code = 9000, ...params) {
		super();
		
		this.code = code;
		this.status = messages[code].status;
		this.message = typeof messages[code].message === 'function'
		               ? messages[code].message(...params)
		               : messages[code].message;
		
		return this;
	}
	
	static get CODES() {
		return CODES;
	}
}

module.exports = ErrorList;

const axios = require('axios');

module.exports = async (city) => {
	let objects = {
		'Санкт-Петербург': [
			'ГБО-2020-0018',
			'ГБО-2020-0028',
			'ГБО-2020-0028',
			'01-02СПБ',
			'ГБО-2020-0017',
			'ГБО-2020-0033',
			'ГБО-2020-0034',
			'ГБО-2020-0035',
			'ГБО-2020-0020',
			'1120_Л07',
			'1120_Л08',
			'ГБО-2020-0025',
			'ГБО-2020-0029',
			'1120_Л06',
		],
		'Ленинградская область': ['1120_Л03', '1120_Л01', '1120_Л04'],
		'Нижний Новгород': ['ГБО-2020-0028', 'ГБО-2020-0028'],
		'Москва': [
			'ГБО-2020-0017',
			'ГБО-2020-0021',
			'ГБО-2020-0024',
			'ГБО-2020-0016',
			'ГБО-2020-0019',
			'ГБО-2020-0030',
			'ГБО-2020-0029',
			'ГБО-2020-0031',
			'ГБО-2020-0032',
		],
		'Тамбов': ['1120_Л02', '1120_Т01'],
		'Краснодар': ['1120_Л06'],
		'Уфа': ['ГБО-2021-ТЕСТ'],
	};
	
	if (city && objects[city]) {
		let listDocument = [];
		if (city === 'Санкт-Петербург') {
			listDocument = objects[city].concat(objects['Ленинградская область']);
		}
		else {
			listDocument = objects[city];
		}
		
		
		let result = await axios.post('https://atcgaz.bitrix24.ru/rest/10028/v3ywifvkfhtwi2jn/disk.folder.getchildren.json?id=196474');
		
		listDocument = listDocument.map((item) => {
			let id = result.data.result.find((i) => i.NAME === item).ID;
			let storage_id = result.data.result.find((i) => i.NAME === item).STORAGE_ID;
			let created = result.data.result.find((i) => i.NAME === item).CREATE_TIME;
			let update = result.data.result.find((i) => i.NAME === item).UPDATE_TIME;
			
			return {
				id,
				storage_id,
				created,
				update,
				value: item,
			};
		});
		
		return listDocument;
	}
	else {
		return [];
	}
};

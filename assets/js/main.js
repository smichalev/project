$(function () {
	const MODE = $('meta[name="mode"]').attr('content');
	
	function sendAuthorizationForm() {
		$('div[data-name="authorization"] button[type="submit"]').on('click', () => {
			$('div[data-name="authorization"] div[role="alert"]').hide().text('');
			
			let params = {};
			
			if ($('#loginInput').val().length > 0) {
				params.login = $('#loginInput').val();
			}
			
			if ($('#passwordInput').val().length > 0) {
				params.password = $('#passwordInput').val();
			}
			
			$.post(MODE === 'development' ? "/login" : "/project/login", params)
				.then(() => location = MODE === 'development' ? "/" : "/project/")
				.catch((err) => $('div[data-name="authorization"] div[role="alert"]').show().text(err.responseJSON.message));
		});
	}
	
	function logoutBtn() {
		$('#logoutBtn').on('click', () => {
			$.post(MODE === 'development' ? "/logout" : "/project/logout").then(() => location = MODE === 'development' ? '/login' : '/project/login');
		});
	}
	
	function deleteCity() {
		$('#listCity div.btn[data-name="delete-city"]').on('click', (e) => {
			if ($(e.target).attr('data-id')) {
				$('#listCity div.alert').hide();
				$('#listCity div.alert').text('');
				$('#listCity div.alert').removeClass('alert-danger').addClass('alert-default');
				
				$.post(MODE === 'development' ? "/delete-city" : "/project/delete-city", {
						_id: $(e.target).attr('data-id'),
					})
					.then((data) => {
						let count = +($('#listCity').attr('data-count'));
						count = count - 1;
						
						$('#listCity').attr('data-count', count);
						
						if (+($('#listCity').attr('data-count')) === 0) {
							$('#listCity div.alert').show();
						}
						
						$('#citySelect').attr('data-count', +($('#citySelect').attr('data-count')) - 1);
						
						
						if (+($('#citySelect').attr('data-count')) === 0) {
							$('#citySelect').attr('disabled', true);
							$('#userList').parent().find('button.btn').attr('disabled', true);
						}
						
						$('#citySelect option[value="' + data.result + '"]').remove();
						
						$('#listCity [data-id="' + data.result + '"]').remove();
					})
					.catch((err) => {
						$('#listCity div.alert').show();
						$('#listCity div.alert').text(err.responseJSON.message);
						$('#listCity div.alert').removeClass('alert-default').addClass('alert-danger');
					});
			}
		});
	}
	
	function addNewCity() {
		$('#cityInput').parent().parent().find('button.btn').on('click', () => {
			$('#cityInput').parent().parent().find('div.alert').hide();
			$('#cityInput').parent().parent().find('div.alert').text('');
			
			let params = {};
			
			if ($('#cityInput').val().length) {
				params.city = $('#cityInput').val();
			}
			
			$.post(MODE === 'development' ? "/new-city" : "/project/new-city", params)
				.then((data) => {
					let count = +($('#listCity').attr('data-count'));
					count = count + 1;
					$('#listCity').attr('data-count', count);
					
					if (+($('#listCity').attr('data-count')) > 0) {
						$('#listCity').find('div.alert').hide();
					}
					
					$('#citySelect').attr('data-count', +($('#citySelect').attr('data-count')) + 1);
					
					if (+($('#citySelect').attr('data-count')) > 0) {
						$('#citySelect').attr('disabled', false);
					}
					$('#userList').parent().find('button.btn').attr('disabled', false);
					
					$('#citySelect').append('<option value="' + data.result._id + '">' + data.result.name + '</option>');
					
					$('#cityInput').val('');
					$('#listCity')
						.append('<div class="d-flex justify-content-between align-items-center mb-2" data-id="' + data.result._id + '"><div>' + data.result.name + '</div><div class="btn btn-danger btn-sm" data-id="' + data.result._id + '" data-name="delete-city">Удалить</div></div>');
					deleteCity();
				})
				.catch((err) => {
					$('#cityInput').parent().parent().find('div.alert').show();
					$('#cityInput').parent().parent().find('div.alert').text(err.responseJSON.message);
				});
		});
	}
	
	function newUser() {
		$('#userList').parent().find('button.btn').on('click', (e) => {
			let params = {};
			
			if ($('#loginInput').val().length) {
				params.login = $('#loginInput').val();
			}
			
			if ($('#passwordInput').val().length) {
				params.password = $('#passwordInput').val();
			}
			
			if ($('#citySelect').val().length && $('#citySelect').val() !== 'Выберите город') {
				params.city = $('#citySelect').val();
			}
			
			$('#loginInput').parent().parent().find('div.alert').hide();
			$('#loginInput').parent().parent().find('div.alert').text('');
			
			$.post(MODE === 'development' ? "/new-user" : "/project/new-user", params)
				.then((data) => {
					$('#userList').attr('data-count', +($('#userList').attr('data-count')) + 1);
					$('#userList')
						.append('<div class="d-flex justify-content-between align-items-center" data-id="' + data.result._id + '"><div class="d-flex flex-column"><div>' + data.result.login + '</div><div style="font-size: 12px">Пользователь</div></div><div class="btn btn-danger btn-sm"  data-id="' + data.result._id + '" data-name="delete-user">Удалить</div></div>');
				})
				.catch((err) => {
					$('#loginInput').parent().parent().find('div.alert').show();
					$('#loginInput').parent().parent().find('div.alert').text(err.responseJSON.message);
				});
		});
	}
	
	sendAuthorizationForm();
	logoutBtn();
	addNewCity();
	deleteCity();
	newUser();
});

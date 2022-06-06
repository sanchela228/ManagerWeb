
var vAccount = new Vue({
	el: "#account-page",
	data: function () {
		return {
			load: false,
			user: {
				view: "list",
				current: undefined,
				list: undefined,
				selectFromList: undefined,
				selectName: undefined,
				email: undefined,
				password: undefined,
				settings: {
					this: undefined
				}
			},
			group: {
				view: "list",
				current: undefined,
				list: undefined,
				selectFromList: undefined,
				selectName: undefined,
				updateErr: {
					status: false,
					text: "Пустое имя"
				}
			}
		}
	},
	methods:
	{
		Delete: function (el, type)
		{
			if (type == "group")
			{
				axios.delete('/api/APISection/' + el.ID);

				let thisVue = this;

				let sectionsData = axios({ method: "get", url: "/api/APISection/response", responseType: "json" });
				sectionsData.then(function (response) {
					thisVue.group.list = response.data.ListSection;
					thisVue.group.selectFromList = response.data.CurrentSection.ID;
				});

				this.group.view = "list";
			}

			if (type == "user")
			{

            }
			
		},
		Take: function (object, type)
		{
			switch (type)
			{
				case "group":
					this.group.view = "detail";
					this.group.current = object;
				break
				case "user":
					this.user.view = "detail";
					this.user.current = object;
				break
			}
		},
		BackToList: function (el)
		{
			el.view = "list";
			el.current = undefined;
		},
		EditGroup: function (el)
		{
			el.view = "edit";
		},
		SaveGroup: function (e)
		{
			e.preventDefault();

			if (this.group.view = "edit" && this.group.current != undefined)
			{
				if (this.group.current.NAME == "") this.group.updateErr.status = true;

				if (this.group.updateErr.status == false)
				{
					let thisVue = this;
					axios.put('/api/APISection/' + this.group.current.ID, this.group.current)
						.then(res => {
							thisVue.group.view = "detail";
							console.log(res);
						});
				}
			}
			else
			{
				this.group.updateErr.status = true;
				this.group.updateErr.text = "Неизвестная ошибка";
			}
		},
		CreateGroup: function ()
		{
			if (this.group.view = "edit" && this.group.selectName != undefined)
			{
				let thisVue = this;
				axios.post('/api/APISection',
					{
						NAME: thisVue.group.selectName,
						PARENT_SECTION: thisVue.group.selectFromList
					}
				).then(function (response)
				{
					thisVue.group.list.push(response.data);
					thisVue.group.view = "list";
				});
			}
		},

		CreateUser: function (event)
		{
			let thisVue = this;
			axios.post('/api/APIUser',
				{
					Password: this.user.password,
					ModelUser: {
						NAME: this.user.selectName,
						Email: this.user.email,
						userName: this.user.email,
						SECTION_ID: this.user.selectFromList,
						EDIT_USER: true,
						EDIT_SECTION: true,
					}
				}
			).then(function (response)
			{
				let usersData = axios({ method: "get", url: "/api/APIUser/response", responseType: "json" });
				usersData.then(function (response) {
					thisVue.user.list = response.data.ListUsers;
					thisVue.user.settings.this = response.data.CurrentUser;
					thisVue.user.view = "list";
					thisVue.load = true;
				});
			});

			event.preventDefault();
		}
	},
	created()
	{
		console.log("on create vue");
		let thisVue = this;

		let sectionsData = axios({ method: "get", url: "/api/APISection/response", responseType: "json" });
		sectionsData.then(function (response) {
			thisVue.group.list = response.data.ListSection;
			thisVue.group.selectFromList = response.data.CurrentSection.ID;

			
		});

		let usersData = axios({ method: "get", url: "/api/APIUser/response", responseType: "json" });
		usersData.then(function (response) {
			thisVue.user.list = response.data.ListUsers;
			thisVue.user.settings.this = response.data.CurrentUser;

			thisVue.load = true;
		});

	}
})



console.log(vAccount);
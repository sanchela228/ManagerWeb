
var vAccount = new Vue({
	el: "#account-page",
	data: function () {
		return {
			load: false,
			user: undefined,
			group: {
				view: "list",
				list: undefined,
				current: undefined,
				updateErr: {
					status: false,
					text: "Пустое имя"
				}
			}
		}
	},
	methods:
	{
		TakeGroup: function (group)
		{
			this.group.view = "detail";
			this.group.current = group;
		},
		BackToList: function ()
		{
			this.group.view = "list";
			this.group.current = undefined;
		},
		EditGroup: function ()
		{
			this.group.view = "edit";
			console.log(this);
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
		}
	},
	created()
	{
		console.log("on create vue");
		let thisVue = this;

		let sectionsData = axios({ method: "get", url: "/api/APISection", responseType: "json" });
		sectionsData.then(function (response) {
			thisVue.group.list = response.data;
			
		});

		let userData = axios({ method: "get", url: "/api/APISection/user", responseType: "json" });
		userData.then(function (response) {
			thisVue.user = response.data;
			thisVue.load = true;
		});



	}
})



console.log(vAccount);
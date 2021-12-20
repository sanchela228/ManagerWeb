

var secrets = new Vue({
	el: "#secrets-index",
	data: function ()
	{
		return {
			load: false,
			ops: {
				vuescroll: {
					mode: 'native',
					sizeStrategy: 'percent',
					detectResize: true,
					/** Enable locking to the main axis if user moves only slightly on one of them at start */
					locking: true,
				},
				scrollPanel: {
					initialScrollY: false,
					initialScrollX: false,
					scrollingX: false,
					scrollingY: true,
					speed: 20,
					easing: undefined,
					verticalNativeBarPos: 'right'
				},
				rail: {
						
				},
				bar: {
					background: 'black',
					opacity: 0.6
				},
			},
			countPersonalGroup: 0,
			search: "", // search input value
			arSecrets: undefined, // list secrets array
			currentSecretsView: undefined, // secret object
			currentSecretsID: undefined, // secret id
			objUpdateSecret: {  // secret object to update
				OPEN_GUID: undefined,
				NAME: undefined,
				LINK: undefined,
				LOGIN: undefined,
				PASSWORD: undefined,
				COMMENT: undefined,
				HEX_COLOR: undefined,
			},
			viewSecretsDetail: false, // show detail view
			detailForm: {
				typeAction: "",
				fails: false,
				fields:
				{
					OPEN_GUID: {
						VALUE: false,
						TYPE: "open",
						FAILED: false,
						TEXT: "Открытый ключ"
					},
					HEX_COLOR: {
						VALUE: null,
						TYPE: "open",
						FAILED: false,
						TEXT: "Цвет маркера"
					},
					NAME: {
						VALUE: null,
						TYPE: "open",
						FAILED: false,
						TEXT: "Имя"
					},
					LINK: {
						VALUE: null,
						TYPE: "requried",
						FAILED: false,
						TEXT: "Ссылка"
					},
					LOGIN: {
						VALUE: null,
						TYPE: "requried",
						FAILED: false,
						TEXT: "Логин"
					},
					PASSWORD: {
						VALUE: null,
						TYPE: "requried",
						FAILED: false,
						TEXT: "Пароль",
					},
					COMMENT: {
						VALUE: null,
						TYPE: "open",
						FAILED: false,
						TEXT: "Комментарий"
					}
				}
			},
			afterform: false,
			passwordView: true,
			sectionList: undefined,
			hexColors: ["#e74131", "#c85cf5", "#5f75df", "#6cdf8f", "#a3df6c", "#c3c3c3"]
		}
	},
	computed:
	{
		computedArSecrets: function ()
		{
			var vm = this;
			return this.arSecrets.filter(function (item) {
				return item.NAME.toLowerCase().indexOf(vm.search.toLowerCase()) !== -1
			});
		}
	},
	methods:
	{
		ShowPasswordLine: function ()
		{
			this.passwordView = !this.passwordView;
		},
		checkForm: function (e)
		{
			e.preventDefault();

			if (this.detailForm.typeAction == "create" || this.detailForm.typeAction == "edit")
			{
				let isFailed = false;

				for (key in this.detailForm.fields)
				{
					let field = this.detailForm.fields[key];

					if (field.TYPE == "requried")
					{
						if (field.VALUE == "" || field.VALUE == null || field.VALUE == undefined || field.VALUE == false)
						{
							this.detailForm.fails = true;
							isFailed = true;
							field.FAILED = true;
						}
						else
						{
							field.FAILED = false;
						}
					}
				}

				if (!isFailed) this.detailForm.fails = false;
					
				if (isFailed == false && this.detailForm.fails == false)
				{
					console.log("all ok");
					let objVueThis = this;

					switch (this.detailForm.typeAction)
					{
						case "edit":
							for (key in this.detailForm.fields) this.currentSecretsView[key] = this.detailForm.fields[key].VALUE;
							axios.put('/api/APISecrets/' + this.currentSecretsView.ID, this.currentSecretsView)
							.then(function (response)
							{
								console.log(response);
								objVueThis.detailForm.typeAction = "view";
							})
							.catch(function (error)
							{
								console.log(error);
							});
						break;

						case "create":
							for (key in this.detailForm.fields) this.objUpdateSecret[key] = this.detailForm.fields[key].VALUE;
							console.log(this.objUpdateSecret);

							axios.post('/api/APISecrets', this.objUpdateSecret)
							.then(function (response)
							{
								objVueThis.arSecrets.unshift(response.data);
								objVueThis.currentSecretsView = response.data;
								objVueThis.detailForm.typeAction = "view";
							})
							.catch(function (error)
							{
								console.log(error);
							});
						break;
					}
				}
			}
		},
		ShowSecretDetail: function(typeAction, id = null)
		{
			this.passwordView = true;

			for (key in this.detailForm.fields)
			{
				if (key == "OPEN_GUID")
				{
					this.detailForm.fields[key].VALUE = false;
				}
				else
				{
					this.detailForm.fields[key].VALUE = null;
				}
				this.detailForm.fields[key].FAILED = false;
			}

			switch (typeAction)
			{
				case "view":
					if (id != null)
					{
						if (this.viewSecretsDetail == false) this.viewSecretsDetail = true;
						this.detailForm.typeAction = typeAction;
						this.currentSecretsView = this.arSecrets[id];
						this.currentSecretsID = id;
					}
				break;

				case "edit":
					if (this.viewSecretsDetail == false) this.viewSecretsDetail = true;
					this.detailForm.typeAction = typeAction;

					for (key in this.currentSecretsView)
					{
						if (this.detailForm.fields[key] == undefined) continue;
						this.detailForm.fields[key].VALUE = this.currentSecretsView[key];
					}
				break;

				case "create":
					if (this.viewSecretsDetail == false) this.viewSecretsDetail = true;
					this.detailForm.typeAction = typeAction;
					this.currentSecretsView = undefined;
					this.currentSecretsID = undefined;
				break;

				case "delete":
					if (this.viewSecretsDetail == true) this.viewSecretsDetail = false;
					this.currentSecretsView = undefined;
					this.currentSecretsID = undefined;

				break;
			}

			console.log(this)
		},
		DeleteSecret: function ()
		{
			axios.delete('/api/APISecrets/' + this.currentSecretsView.ID);
			this.arSecrets.splice(this.currentSecretsID, 1);

			this.ShowSecretDetail("delete");
		},
		// start search 
		beforeEnter: function (el)
		{
			el.style.opacity = 0
			el.style.height = 0
			el.style.paddingBottom = 0
		},
		enter: function (el, done)
		{
			var delay = el.dataset.index;
			setTimeout(function () {
				Velocity(
					el,
					{ opacity: 1, height: '28px', paddingBottom: '10px' },
					{ complete: done }
				)
			}, delay)
		},
		leave: function (el, done)
		{
			var delay = el.dataset.index;
			setTimeout(function () {
				Velocity(
					el,
					{ opacity: 0, height: 0, paddingBottom: 0 },
					{ complete: done }
				)
			}, delay)
		},
		//end search

		// copy
		ToCopy: function (copytext, view = true)
		{
			let textArea = document.createElement("textarea");
			textArea.value = copytext;
			textArea.style.top = "0";
			textArea.style.left = "0";
			textArea.style.opacity = "0";
			textArea.style.position = "fixed";

			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
				
			try
			{
				document.execCommand('copy');
				if (view)
				{
					let copyNotification = document.createElement("p");
					let eY = event.pageY + 0;
					let eX = event.pageX + 20;
					copyNotification.textContent = "Скопировано";
					copyNotification.className = "clipboard-message";
					copyNotification.style.position = "absolute";
					copyNotification.style.top = eY + "px";
					copyNotification.style.left = eX + "px";

					document.body.appendChild(copyNotification);

					window.requestAnimationFrame(function ()
					{
						copyNotification.style.width = "105px";
						setTimeout(() => {
							copyNotification.style.width = "0";
							copyNotification.style.padding = "0";
							setTimeout(() => {
								document.body.removeChild(copyNotification);
							}, 700);
						}, 700);
					});
				}
			}
			catch (err)
			{
				console.error('Fallback: Oops, unable to copy', err);
			}

			document.body.removeChild(textArea);
		},
		test1: function (test) {
			console.log(this);
		}
	},
	created()
	{
		let thisVueObject = this;
		let success = false;

		// gets
		let secretsData = axios({ method: "get", url: "/api/APISecrets", responseType: "json" });
		secretsData.then(function (response)
		{
			Secrets = new Array;

			for (var index = 0; index < response.data.length; index++)
			{
				Secrets = Secrets.concat(response.data[index]);
			}

			thisVueObject.arSecrets = Secrets;
			thisVueObject.load = true;
		});

		let userscountData = axios({ method: "get", url: "/api/APISection/users", responseType: "json" });
		userscountData.then(function (response) {
			thisVueObject.countPersonalGroup = response.data.length;
		});

		let sectionlistData = axios({ method: "get", url: "/api/APISection", responseType: "json" });
		sectionlistData.then(function (response) {
			thisVueObject.sectionList = response.data;
		});


	}
});

console.log(secrets);



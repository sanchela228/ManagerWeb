
let getData = axios({ method: "get", url: "/api/APISecrets", responseType: "json" });

getData.then(function (response)
{
	let axiSecretsList = response.data;

	var secrets = new Vue({
		el: "#secrets-index",
		data: function () {
			return {
				search: "", // search input value
				arSecrets: axiSecretsList, // list secrets array
				currentSecretsView: undefined, // secret object
				currentSecretsID: undefined, // secret id
				objUpdateSecret: {  // secret object to update
					OPEN_GUID: undefined,
					NAME: undefined,
					LINK: undefined,
					LOGIN: undefined,
					PASSWORD: undefined,
					COMMENT: undefined
				},
				viewSecretsDetail: false, // show detail view
				detailForm: {
					typeAction: "view",
					fails: false,
					fields:
					{
						OPEN_GUID: {
							VALUE: false,
							TYPE: "open",
							FAILED: false,
							TEXT: "Открытый ключ"
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
			
			checkForm: function (e)
			{
				e.preventDefault();

				if (this.detailForm.typeAction == "create")
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

						for (key in this.detailForm.fields) this.objUpdateSecret[key] = this.detailForm.fields[key].VALUE;

						console.log(this.objUpdateSecret);

						let objVueThis = this;

						axios.post('/api/APISecrets', this.objUpdateSecret)
						.then(function (response)
						{
							console.log(response);
							objVueThis.arSecrets.unshift(response.data);
							
						})
						.catch(function (error)
						{
							console.log(error);
						});
					}
				}
			},
			ShowSecretDetail: function(typeAction, id = null)
			{
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
					break;
				}
			},
			DeleteSecret: function ()
			{
				axios.delete('/api/APISecrets/' + this.currentSecretsView.ID);
				this.arSecrets.splice(this.currentSecretsID, 1);
			},
			// start search 
			beforeEnter: function (el)
			{
				el.style.opacity = 0
				el.style.height = 0
			},
			enter: function (el, done)
			{
				var delay = el.dataset.index;
				setTimeout(function () {
					Velocity(
						el,
						{ opacity: 1, height: '83px' },
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
						{ opacity: 0, height: 0 },
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
			}

		},
		created()
		{

		}
	});

	console.log(secrets);
});




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
				viewSecretsDetail: false, // show detail view
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
			ShowSecretDetail: function(id)
			{
				if (this.viewSecretsDetail == false) this.viewSecretsDetail = true;
				this.currentSecretsView = this.arSecrets[id];
			},

			// start search 
			beforeEnter: function (el)
			{
				el.style.opacity = 0
				el.style.height = 0
			},
			enter: function (el, done)
			{
				var delay = el.dataset.index * 150
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
				var delay = el.dataset.index * 150
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


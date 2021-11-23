
let getData = axios({ method: "get", url: "/api/APISecrets", responseType: "json" });

getData.then(function (response)
{
	let axiSecretsList = response.data;

	var secrets = new Vue({
		el: "#secrets-index",
		data: function () {
			return {
				search: "",
				arSecrets: axiSecretsList
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
			}
			//end search
		},
		created()
		{

		}
	});

	console.log(secrets);
});


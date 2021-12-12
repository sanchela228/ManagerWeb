window.onload = function ()
{
	var testvue = new Vue({
		el: "#account-page",
		data: function () {
			return {
				load: false,
				user: undefined,
				sections: undefined
			}
		},
		methods: {},
		created()
		{
			console.log("on create vue");
			let thisVue = this;
			let getData = axios({ method: "get", url: "/api/APISection", responseType: "json" });
			getData.then(function (response) {
				thisVue.sections = response.data;
				thisVue.load = true;
			});
		}
	})
}

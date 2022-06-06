using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ManagerWeb.Core;
using ManagerWeb.Models;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;

namespace ManagerWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class APIUser : ControllerBase
    {
		private readonly UserManager<User> _userManager;
		private readonly ManagerWebContext _context;

        public APIUser(ManagerWebContext context, UserManager<User> userManager)
        {
            _context = context;
			_userManager = userManager;
		}

		[HttpGet]
		public string GetUsers()
		{
			var currentUser = _userManager.GetUserAsync(User);
			string codeSection = currentUser.Result.SECTION_ID.ToString();

			var usersList = _userManager.Users.Where(b => b.SECTION_ID.ToString() == codeSection);

			return JsonConvert.SerializeObject(usersList);
		}

		[HttpGet("response")]
		public string GetUsersResponse()
		{
			List<Section> listSections = _context.Section.ToList();
			var response = new Models.Responses.rUsers();

			response.CurrentUser = _userManager.GetUserAsync(User).Result;

			string codeSection = response.CurrentUser.SECTION_ID.ToString();
			var ListSection = GetChildren(listSections, codeSection);

			response.ListUsers = _userManager.Users.Where(b => b.SECTION_ID.ToString() == codeSection).ToList();
			response.Count = response.ListUsers.Count();

			return JsonConvert.SerializeObject(response);
		}

		List<Section> GetChildren(List<Section> listSections, string id)
		{
			return listSections
				.Where(x => x.PARENT_SECTION.ToString() == id)
				.Union(listSections.Where(x => x.PARENT_SECTION.ToString() == id)
					.SelectMany(y => GetChildren(listSections, y.ID.ToString()))
				).ToList();
		}


		[HttpPost]
		public async Task<IdentityResult> RegisterAsync(RegistrationModel model)
		{
			var test = await SeedUsers(model, _userManager);

			return test;
		}

		private static async Task<IdentityResult> SeedUsers(RegistrationModel model, UserManager<User> userManager)
		{
			User user = new User
			{
				Email = model.ModelUser.Email,
				UserName = model.ModelUser.UserName,
				NAME = model.ModelUser.NAME,
				SECTION_ID = model.ModelUser.SECTION_ID,
				EDIT_USER = model.ModelUser.EDIT_USER,
				EDIT_SECTION = model.ModelUser.EDIT_SECTION,
			};

			IdentityResult result = await userManager.CreateAsync(user, model.Password);
			

			return result;
		}
	}
}
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
			var response = new Models.Responses.rUsers();

			response.CurrentUser = _userManager.GetUserAsync(User).Result;

			string codeSection = response.CurrentUser.SECTION_ID.ToString();
			response.ListUsers = _userManager.Users.Where(b => b.SECTION_ID.ToString() == codeSection).ToList();
			response.Count = response.ListUsers.Count();

			return JsonConvert.SerializeObject(response);
		}
	}
}
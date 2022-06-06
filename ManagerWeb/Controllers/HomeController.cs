using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ManagerWeb.Models;
using Microsoft.AspNetCore.Identity;

namespace ManagerWeb.Controllers
{
	public class HomeController : Controller
	{
		private readonly UserManager<User> _userManager;
		private readonly SignInManager<User> _signInManager;

		public HomeController(UserManager<User> userManager, SignInManager<User> signInManager)
		{
			_userManager = userManager;
			_signInManager = signInManager;
		}

		public IActionResult Index()
		{
			if (User.Identity.IsAuthenticated)
			{
				return LocalRedirect("~/Secrets/");
			}
			else
			{
				return View();
			}
		}

		public IActionResult Account()
		{
			if (!User.Identity.IsAuthenticated)
			{
				return LocalRedirect("/");
			}

			return View();
		}

		[HttpPost]
		public async Task<IActionResult> Index([Bind("Email")] User user, string Password)
		{
            var result = await _signInManager.PasswordSignInAsync(user.Email, Password, true, false);
            if (result.Succeeded)
            {
                return LocalRedirect("~/Secrets/");
            }
            else
            {
                return Index();
            }
        }

		[HttpPost]
		public async Task<IActionResult> Logout()
		{
			await _signInManager.SignOutAsync();
			return LocalRedirect("/");
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}

	}
}

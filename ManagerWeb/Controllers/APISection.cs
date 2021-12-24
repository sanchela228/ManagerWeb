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
    public class APISection : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ManagerWebContext _context;

        public APISection(ManagerWebContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public string GetSection()
        {
            var currentUser = _userManager.GetUserAsync(User);
            var codeSection = currentUser.Result.SECTION_ID.ToString();

			List<Section> listSections = _context.Section.ToList();

			var listSectionsChildrens = GetChildren(listSections, codeSection);
			string jsonSections = JsonConvert.SerializeObject(listSectionsChildrens);

			return jsonSections;
		}

		List<Section> GetChildren(List<Section> listSections, string id)
		{
			return listSections
				.Where(x => x.PARENT_SECTION.ToString() == id)
				.Union(listSections.Where(x => x.PARENT_SECTION.ToString() == id)
					.SelectMany(y => GetChildren(listSections, y.ID.ToString()))
				).ToList();
		}

		[HttpGet("users")]
        public string GetUsersBySection()
        {
            var currentUser = _userManager.GetUserAsync(User);
            string codeSection = currentUser.Result.SECTION_ID.ToString();

            var usersList = _userManager.Users.Where(b => b.SECTION_ID.ToString() == codeSection);
            string json = JsonConvert.SerializeObject(usersList);

            return json;
        }
    }
}
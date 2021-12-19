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
            string codeSection = currentUser.Result.SECTION_ID.ToString();

            var Sections = _context.Section.FromSql(
                @"select  ID, NAME, PARENT_SECTION, CREATOR_ID
					from    (select * from section
								order by PARENT_SECTION, ID) products_sorted,
							(select @pv := '" + codeSection + @"') initialisation
					where   find_in_set(PARENT_SECTION, @pv)
					and     length(@pv := concat(@pv, ',', ID))");

            string jsonSections = JsonConvert.SerializeObject(Sections);

            return jsonSections;
        }

        [HttpGet("api/[controller]/{apiname}", Name = "users")]
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
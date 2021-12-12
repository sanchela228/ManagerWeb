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
            var Sections = _context.Section.FromSql(
                @"select *
                    from section employee
                    join section manager
                    on manager.ID=employee.PARENT_SECTION
                    where manager.ID='94240316-7700-430b-837d-280bb9d31997'");

            //94240316-7700-430b-837d-280bb9d31997
            Console.WriteLine(Sections);
            string jsonSections = JsonConvert.SerializeObject(Sections);

            return jsonSections;


            //var sections = _context.Section.OrderByDescending(b => b.NAME);
            //string jsonSections = JsonConvert.SerializeObject(sections);

            //return jsonSections;
        }



    }
}
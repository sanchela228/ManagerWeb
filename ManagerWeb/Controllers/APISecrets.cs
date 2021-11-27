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

namespace ManagerWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class APISecrets : ControllerBase
    {
        private readonly ManagerWebContext _context;

        public APISecrets(ManagerWebContext context)
        {
            _context = context;
        }

        // /api/APISecrets get json secrets
        [HttpGet]
        public string GetSecrets()
        {
			var secret = _context.Secrets.OrderByDescending(b => b.ID);

            string jsonTest = JsonConvert.SerializeObject(secret);

            return jsonTest;
        }

		// /api/APISecrets add secret
		[HttpPost]
		public string PostSecrets(Secrets Secret)
		{
            Secret.GUID = Guid.NewGuid();
            Secret.CREATOR_ID = 0;

            _context.Secrets.Add(Secret);
			_context.SaveChanges();

            return JsonConvert.SerializeObject(Secret);
        }
    }
}
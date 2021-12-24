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
    public class APISecrets : ControllerBase
    {
		private readonly UserManager<User> _userManager;
		private readonly ManagerWebContext _context;

        public APISecrets(ManagerWebContext context, UserManager<User> userManager)
        {
            _context = context;
			_userManager = userManager;
		}

        // /api/APISecrets get json secrets
        [HttpGet]
        public string GetSecrets()
        {
			var currentUser = _userManager.GetUserAsync(User);
			var codeSection = currentUser.Result.SECTION_ID.ToString();

			List<Section> listSections = _context.Section.ToList();
			List<Secrets> listSecrets = new List<Secrets>();

			var listSectionsChildrens = GetChildren(listSections, codeSection);
			listSectionsChildrens.AddRange(_context.Section.Where(b => b.ID.ToString() == codeSection));

			foreach(Section section in listSectionsChildrens)
			{
				listSecrets.AddRange(_context.Secrets.Where(b => b.SECTION_ID == section.I);
			}

			string jsonSections = JsonConvert.SerializeObject(listSecrets);
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

		// /api/APISecrets add secret
		[HttpPost]
		public string PostSecrets([FromBody] Secrets Secret)
		{
            Secret.GUID = Guid.NewGuid();
            Secret.CREATOR_ID = new Guid(_userManager.GetUserId(User));

			var currentUser = _userManager.GetUserAsync(User);
			string codeSection = currentUser.Result.SECTION_ID.ToString();

			Secret.SECTION_ID = new Guid(codeSection);

			_context.Secrets.Add(Secret);
			_context.SaveChanges();

            return JsonConvert.SerializeObject(Secret);
        }

        // /api/APISecrets/5  delete secret
        [HttpDelete("{id}")]
        public string DeleteSecrets([FromRoute] int id)
        {
            var secrets = _context.Secrets.Find(id);

            if (secrets == null)
            {
                return "not found";
            }

            _context.Secrets.Remove(secrets);
            _context.SaveChanges();

            return "delete ok";
        }

		// PUT: api/APISecrets/5
		[HttpPut("{id}")]
		public string PutSecrets([FromRoute] int id, [FromBody] Secrets secrets)
		{
			if (id != secrets.ID)
			{
				return "not found";
			}

			_context.Entry(secrets).State = EntityState.Modified;

			try
			{
				 _context.SaveChanges();
			}
			catch (DbUpdateConcurrencyException)
			{
				throw;
			}

			return "edit ok";
		}
	}
}
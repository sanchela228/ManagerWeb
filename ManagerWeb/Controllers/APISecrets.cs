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

        // GET: api/APISecrets
        [HttpGet]
        public string GetSecrets()
        {
			var test = _context.Secrets;
			string jsonTest = JsonConvert.SerializeObject(test);

            return jsonTest;
        }

        // GET: api/APISecrets/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSecrets([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var secrets = await _context.Secrets.FindAsync(id);

            if (secrets == null)
            {
                return NotFound();
            }

            return Ok(secrets);
        }

        // PUT: api/APISecrets/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSecrets([FromRoute] int id, [FromBody] Secrets secrets)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != secrets.ID)
            {
                return BadRequest();
            }

            _context.Entry(secrets).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SecretsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/APISecrets
        [HttpPost]
        public async Task<IActionResult> PostSecrets([FromBody] Secrets secrets)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Secrets.Add(secrets);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSecrets", new { id = secrets.ID }, secrets);
        }

        // DELETE: api/APISecrets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSecrets([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var secrets = await _context.Secrets.FindAsync(id);
            if (secrets == null)
            {
                return NotFound();
            }

            _context.Secrets.Remove(secrets);
            await _context.SaveChangesAsync();

            return Ok(secrets);
        }

        private bool SecretsExists(int id)
        {
            return _context.Secrets.Any(e => e.ID == id);
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ManagerWeb.Core;
using ManagerWeb.Models;

namespace ManagerWeb.Controllers
{
    public class SecretsController : Controller
    {
        private readonly ManagerWebContext _context;

        public SecretsController(ManagerWebContext context)
        {
            _context = context;
        }

		// GET: Secrets
		public IActionResult Index()
		{
			if (!User.Identity.IsAuthenticated)
			{
				return LocalRedirect("/");
			}

			List<Secrets> listSecrets = _context.Secrets.ToList();
			return View(listSecrets);
		}
		// GET: Secrets/Details/5
		public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var secrets = await _context.Secrets
                .FirstOrDefaultAsync(m => m.ID == id);
            if (secrets == null)
            {
                return NotFound();
            }

            return View(secrets);
        }

        // GET: Secrets/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Secrets/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,GUID,OPEN_GUID,NAME,LINK,LOGIN,PASSWORD,COMMENT,CREATOR_ID")] Secrets secrets)
        {
            if (ModelState.IsValid)
            {
                _context.Add(secrets);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(secrets);
        }

        // GET: Secrets/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var secrets = await _context.Secrets.FindAsync(id);
            if (secrets == null)
            {
                return NotFound();
            }
            return View(secrets);
        }

        // POST: Secrets/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,GUID,OPEN_GUID,NAME,LINK,LOGIN,PASSWORD,COMMENT,CREATOR_ID")] Secrets secrets)
        {
            if (id != secrets.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(secrets);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SecretsExists(secrets.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(secrets);
        }

        // GET: Secrets/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var secrets = await _context.Secrets
                .FirstOrDefaultAsync(m => m.ID == id);
            if (secrets == null)
            {
                return NotFound();
            }

            return View(secrets);
        }

        // POST: Secrets/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var secrets = await _context.Secrets.FindAsync(id);
            _context.Secrets.Remove(secrets);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool SecretsExists(int id)
        {
            return _context.Secrets.Any(e => e.ID == id);
        }
    }
}

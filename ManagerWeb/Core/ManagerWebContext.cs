using ManagerWeb.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ManagerWeb.Core
{
	public class ManagerWebContext : IdentityDbContext<User>
	{
		public ManagerWebContext(DbContextOptions<ManagerWebContext> options)
		   : base(options)
		{
			Database.EnsureCreated();
		}

		public DbSet<Secrets> Secrets { get; set; }
		public DbSet<Section> Section { get; set; }
	}
}

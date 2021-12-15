using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace ManagerWeb.Models
{
	public class User : IdentityUser
	{
		public string NAME { get; set; }
		public Guid SECTION_ID { get; set; }
		public bool EDIT_USER { get; set; }
		public bool EDIT_SECTION { get; set; }
	}
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ManagerWeb.Models
{
	public class Section
	{
		public Guid ID { get; set; }
		public string NAME { get; set; }
		public Guid? PARENT_SECTION { get; set; }
		public Guid? CREATOR_ID { get; set; }
	}
}

using System;
using System.Collections.Generic;

namespace ManagerWeb.Models.Responses
{
	public class rUsers
	{
		public int Count {get; set;}

		public User CurrentUser { get; set;}

		public List<User> ListUsers { get; set; }

	}
}

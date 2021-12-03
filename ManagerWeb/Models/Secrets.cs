using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ManagerWeb.Models
{
	public class Secrets
	{
		public int ID { get; set; }
		public Guid GUID { get; set; }
		public bool OPEN_GUID { get; set; }
		public string NAME { get; set; }

		[Required(ErrorMessage = "Не указана ссылка")]
		public string LINK { get; set; }

		[Required(ErrorMessage = "Не указан логин")]
		public string LOGIN { get; set; }

		[StringLength(32, ErrorMessage = "Минимум 6 символов", MinimumLength = 6)]
		[DataType(DataType.Password)]
		[Required(ErrorMessage = "Не указан пароль")]
		public string PASSWORD { get; set; }
		public string COMMENT { get; set; }
		public Guid CREATOR_ID { get; set; }

	}
}

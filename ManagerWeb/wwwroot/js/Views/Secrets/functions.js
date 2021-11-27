function CreateObjectUpdateForm(formFields, arrIgnore = false)
{
	let arResult;
	for (key in formFields)
	{
		let field = formFields[key];
		console.log()
		arResult[key] = field.VALUE;
	}

	return arResult;
}
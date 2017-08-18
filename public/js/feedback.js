function submitFeedback()
{
	var page = $('#page').val();
	var description = $("#description").val();
	var suggestion = $('#suggestion').val();
	var postTitle = $('#postTitle').val();
	console.log(page + " " + description);
	console.log('hey');
	
	if(page != '' && description != '' && suggestion != '' && postTitle != '')
	{
		console.log("sending feedback!");
		$.ajax({
			type: 'POST',
			url: 'Data', 
			data: 
			{
				'action': 'postFeedback',
				'title': postTitle,
				'page': page,
				'description': description,
				'suggestion': suggestion,
			},
			complete: function(data)
			{
				console.log(data);
				if(data.reponseJSON == 'feedback creation success')
					alert("Thank you for sending feedback!");
				else
					alert("There was an error! Let an administrator know that something is wrong!");
			},
		});
	}
	else alert("All fields required!");
}

var internshipsAndMentorships = [];

function loadHome()
{
	resize();
	$.ajax({
		type: 'POST',
		url: 'Data', 
		data: 
		{
			'action': 'getInternships',
			'filter': "",
		},
		complete: function(data)
		{
			if(data.responseText == '') {returnToLogin(); return;} 

			if(data.responseJSON.length > 0)
				for(var i = 0; i < data.responseJSON.length; i++)
					internshipsAndMentorships.push(data.responseJSON[i]);
			getMentorships();
		},
	});
}

function getMentorships()
{
	$.ajax({
		type: 'POST',
		url: 'Data', 
		data: 
		{
			'action': 'getMentorships',
			'filter': "",
		},
		complete: function(data)
		{
			if(data.responseJSON.length > 0)
				for(var i = 0; i < data.responseJSON.length; i++)
					internshipsAndMentorships.push(data.responseJSON[i]);
			//fillInternshipAndMentorshipWindow();
			getEvents();
		},
	});	
}

function getEvents()
{
	$.ajax({
		type: 'POST',
		url: 'Data', 
		data: 
		{
			'action': 'getEvents',
			'filter': "upcoming",
		},
		complete: function(data)
		{
			console.log(data.responseJSON);
			if(data.length && data.responseJSON.length > 0)
				;
			getAccount();
		},
	});	
}

function getAccount()
{
	$.ajax({
		type: 'POST',
		url: 'Account', 
		data: 
		{
			'action': 'getUserAccount',
		},
		complete: function(data)
		{
			console.log(data.responseJSON);
			fillInternshipAndMentorshipWindow(data.responseJSON);
		},
	});	
}

function fillInternshipAndMentorshipWindow(user)
{
	var focus = "";
	if(user.focus == 'undefined') focus = "none";
	else focus = user.focus;
	shuffle(internshipsAndMentorships);
	for(var i = 0; i < internshipsAndMentorships.length; i++)
	{
		if(internshipsAndMentorships[i].focus == focus || focus == "")
		{
			var node = document.createElement("li");
			node.onclick = function(){findInternshipOrMentorship(this)};
			
			if(typeof internshipsAndMentorships[i].mentorshipTitle != 'undefined')	
			{
				$(node).append("<p class='title'>" + internshipsAndMentorships[i].mentorshipTitle + "</p>");
			}
			else if(typeof internshipsAndMentorships[i].internshipTitle != 'undefined')
			{
				$(node).append("<p class='title'>" + internshipsAndMentorships[i].internshipTitle + "</p>");
			}
			$(node).append("<p class='location'>Location: " + internshipsAndMentorships[i].location + "</p>");
			$(node).append("<p class='company'>Company: " + internshipsAndMentorships[i].company + "</p>");
			
			$("#positions").append(node);
		}
	}
}

function findInternshipOrMentorship(param)
{
	
}

function shuffle(array) 
{
	  var m = array.length, t, i;

	  // While there remain elements to shuffle…
	  while (m) {

	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
}

function fillHomeField(json)
{
	
}

function resize()
{

}

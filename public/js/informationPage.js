/**
 * javascript page associated with mentorshipInfo and internshipInfo
 * contains similar but not same methods to handle both cases
 */

// internship or mentorship generalized as SHIP
var SHIP;


function loadInternshipByParams()
{
	var internshipID = getParameterByName('id');
	console.log(internshipID);
	
	$.ajax({
		type: 'POST',
		url: 'Data', 
		data: 
		{
			'action': 'getInternshipByID',
			'internshipID': internshipID,
		},
		complete: function(data)
		{
			console.log(data.responseJSON);
			if(data.responseText == '') {returnToLogin(); return;} 
			SHIP = data.responseJSON;
			fillInternshipInformation(data.responseJSON);
		},
	});
}

function checkUser()
{

}

function loadMentorshipByParams()
{
	var mentorshipID = getParameterByName('id');
	console.log(mentorshipID);
	
	$.ajax({
		type: 'POST',
		url: 'Data', 
		data: 
		{
			'action': 'getMentorshipByID',
			'mentorshipID': mentorshipID,
		},
		complete: function(data)
		{
			console.log(data.responseJSON);
			if(data.responseText == '') {returnToLogin(); return;} 
			SHIP = data.responseJSON;
			fillMentorshipInformation(data.responseJSON);
			$('#adminStuff').css('display', 'none');
		},
	});
}

function fillInternshipInformation(json)
{
	
	$('#internshipTitle').html(json.internshipTitle);
	$('#name').html(json.owner.firstName + " " + json.owner.lastName);
	$('#company').html(json.company);
	$('#contact').html(json.contact);
	$('#location').html(json.location + '. ' + json.availability);
	$('#description').html(json.description);
	$('#focus').html(json.focus);
	$('#paid').html(json.paid);
	if(json.active)
	{
		$('#internshipListerButton').prop('disabled', true);
		$('#internshipUnlisterButton').prop('disabled', false);
	}
	else
	{
		$('#internshipListerButton').prop('disabled', false);
		$('#internshipUnlisterButton').prop('disabled', true);	
	}
}

function fillMentorshipInformation(json)
{
	$('#internshipTitle').html(json.mentorshipTitle);
	$('#name').html(json.owner.firstName + " " + json.owner.lastName);
	$('#company').html(json.company);
	$('#contact').html(json.contact);
	$('#location').html(json.location);
	$('#description').html(json.description);
	$('#focus').html(json.focus);
	
	if(json.active)
	{
		$('#mentorshipListerButton').prop('disabled', true);
		$('#mentroshipUnlisterButton').prop('disabled', false);
	}
	else
	{
		$('#mentorshipListerButton').prop('disabled', false);
		$('#mentroshipUnlisterButton').prop('disabled', true);	
	}
}


function showInternshipInformation(source)
{
	$('.accountDetails').addClass('hidden');
	$(source).siblings().removeClass('active');
	$(source).addClass('active');
	$('#information').removeClass('hidden');
}

function showApplicants(source)
{
	$('.accountDetails').addClass('hidden');
	$(source).siblings().removeClass('active');
	$(source).addClass('active');
	$('#applicants').removeClass('hidden');
}

function showAdmin(source)
{
	$('.accountDetails').addClass('hidden');
	$(source).siblings().removeClass('active');
	$(source).addClass('active');
	$('#admin').removeClass('hidden');
}

function listInternship()
{
	$.ajax({
		type: 'POST',
		url: 'Internships', 
		data: 
		{
			'action': 'listInternship',
			'internshipID': SHIP.id,
		},
		complete: function(data)
		{
			console.log(data.responseJSON);
			if(data.responseJSON == true)
			{
				$('#internshipListerButton').prop('disabled', true);
				$('#internshipUnlisterButton').prop('disabled', false);
			}
		},
	});
}

function unlistInternship()
{
	$.ajax({
		type: 'POST',
		url: 'Internships', 
		data: 
		{
			'action': 'unlistInternship',
			'internshipID': SHIP.id,
		},
		complete: function(data)
		{
			console.log(data.responseJSON);
			if(data.responseJSON == true)
			{
				$('#internshipListerButton').prop('disabled', false);
				$('#internshipUnlisterButton').prop('disabled', true);
			}
		},
	});
}

function listMentorship()
{
	$.ajax({
		type: 'POST',
		url: 'Mentorships', 
		data: 
		{
			'action': 'listMentorship',
			'mentorshipID': SHIP.id,
		},
		complete: function(data)
		{
			console.log(data);
			if(data.responseJSON == true)
			{
				$('#mentorshipListerButton').prop('disabled', true);
				$('#mentroshipUnlisterButton').prop('disabled', false);
			}
			
		},
	});
}

function unlistMentorship()
{
	$.ajax({
		type: 'POST',
		url: 'Mentorships', 
		data: 
		{
			'action': 'unlistMentorship',
			'mentorshipID': SHIP.id,
		},
		complete: function(data)
		{
			console.log(data);
			if(data.responseJSON == true)
			{
				$('#mentorshipListerButton').prop('disabled', false);
				$('#mentroshipUnlisterButton').prop('disabled', true);
			}
			
		},
	});
}


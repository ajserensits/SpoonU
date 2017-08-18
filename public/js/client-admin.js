'use strict';

let accounts = null;
let internships = null;
let mentorships = null;
let recommendations = null;
let RETURN_ID = 0;

function showTab (source, param) {
	$('.' + param).siblings().removeClass('active');
	$('.' + param).addClass('active');

	$('.tab-content').removeClass('active');
	$('#' + param).addClass('active');
}


function loadDashboard () {
	var tab = getParameterByName("id");
	if(tab == 'mentorship')
		showTab($('#mentorship'), 'mentorshipTab');
	else if(tab == 'internship')
		showTab($('#internship'), 'internshipTab');
	else if(tab == 'account')
		showTab($('#account'), 'accountTab');

	// get users
	$.ajax({
		type: 'POST',
		url: '/GetAccounts',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getAccounts',
		}), complete: function(data)
		{
			if(data.responseText === 'SERVER_ERROR') {
					return alert('Server Error');
			} else if (data.responseText === 'NOT_ADMIN_USER') {
				window.location.href = 'index.html';
			}

			if(data.responseJSON) {
				accounts = data.responseJSON;
				getInternships();
			}
		},
	});
}

function getInternships()
{
	$.ajax({
		type: 'POST',
		url: '/GetInternships',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getInternships',
		}), complete: function(data) {
			internships = data.responseJSON;
			getMentorships();
		},
	});
}

function getMentorships()
{
	$.ajax({
		type: 'POST',
		url: '/GetMentorships',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getMentorships',
		}), complete: function(data) {
			mentorships = data.responseJSON;

			fillTabs();
			getRecommendations();
		},
	});
}

function fillTabs()
{
	console.log(accounts);
	console.log(internships);
	console.log(mentorships);

	var studentAccounts = 0;
	var advisorAccounts = 0;
	var pendingAccounts = 0;
	for(var i = 0; i < accounts.length; i++)
	{
		if(accounts[i].active == 0)
		{
			pendingAccounts++;
			$('#accountHolder #pendingAccounts').after('<li id="' + accounts[i]._id +
														'" class="pendingAccounts miniAccount hidden"' +
														'>Name: ' + accounts[i].firstName +
														' ' + accounts[i].lastName +
														' -- Email: ' + accounts[i].email +
														' -- As Status: ' + accounts[i].role +
														'<button onclick="handleAccount(this, false)">Decline</button>' +
														'<button onclick="handleAccount(this, true)">Accept</button>' +
														'<button onclick="goToAccountPage(this)">Account Page</button>' +
														'</li>');
			continue;
		}
		if(accounts[i].role === 'student')
		{
			studentAccounts++;
			$('#accountHolder #studentAccounts').after('<li id="' + accounts[i]._id +
													   '" class="studentAccounts miniAccount hidden"' +
													   '>Name: ' + accounts[i].firstName +
													   ' ' + accounts[i].lastName +
													   ' -- Email: ' + accounts[i].email +
													   ' -- Status: ' + accounts[i].role +
														 '<button onclick="handleAccount(this, false)">Suspend</button>' +
													   '<button onclick="goToAccountPage(this)">Account Page</button>' +
													   '</li>');
			$('#accountHolder #registeredAccounts').after('<li id="' + accounts[i]._id +
					   '" class="registeredAccounts miniAccount hidden"' +
					   '>Name: ' + accounts[i].firstName +
					   ' ' + accounts[i].lastName +
					   ' -- Email: ' + accounts[i].email +
					   ' -- Status: ' + accounts[i].role +
						 '<button onclick="handleAccount(this, false)">Suspend</button>' +
					   '<button onclick="goToAccountPage(this)">Account Page</button>' +
					   '</li>');
			continue;
		}
		else if(accounts[i].role === 'advisor')
		{
			advisorAccounts++;
			$('#accountHolder #advisorAccounts').after('<li id="' + accounts[i]._id +
					   '" class="advisorAccounts miniAccount hidden"' +
					   '>Name: ' + accounts[i].firstName +
					   ' ' + accounts[i].lastName +
					   ' -- Email: ' + accounts[i].email +
					   ' -- Status: ' + accounts[i].role +
					   '<button onclick="goToAccountPage(this)">Account Page</button>' +
						 '<button onclick="handleAccount(this, false)">Suspend</button>' +
					   '</li>');

			$('#accountHolder #registeredAccounts').after('<li id="' + accounts[i]._id +
					   '" class="registeredAccounts miniAccount hidden"' +
					   '>Name: ' + accounts[i].firstName +
					   ' ' + accounts[i].lastName +
					   ' -- Email: ' + accounts[i].email +
					   ' -- Status: ' + accounts[i].role +
					   '<button onclick="goToAccountPage(this)">Account Page</button>' +
						 '<button onclick="handleAccount(this, false)">Suspend</button>' +
					   '</li>');
			continue;
		}
	}
	$('#numOfStudentAccounts').html(studentAccounts);
	$('#studentAccounts').html("Student Accounts (" + studentAccounts + ")" + "<span class='expanded'>+</span>");
	$('#numOfAdvisorAccounts').html(advisorAccounts);
	$('#advisorAccounts').html("Advisor Accounts (" + advisorAccounts + ")" + "<span class='expanded'>+</span>");
	$('#numOfPendingAccounts').html(pendingAccounts);
	$('#pendingAccounts').html("Pending Accounts (" + pendingAccounts + ")" + "<span class='expanded'>+</span>");
	$('#registeredAccounts').html('All Registered Accounts (' + (advisorAccounts + studentAccounts) + ")" + "<span class='expanded'>+</span>");

	var pendingInternships = 0;
	var activeInternships = 0;
	for(var i = 0; i < internships.length; i++)
	{
		if(internships[i].active == 0)
		{
			pendingInternships++;
			$('#internshipHolder #pendingInternships').after('<li id="' + internships[i]._id +
					   '" class="pendingInternships miniAccount hidden"' +
					   '>Company: ' + internships[i].company +
						'<button onclick="handleInternship(this, false)">Decline</button>' +
						'<button onclick="handleInternship(this, true)">Accept</button>' +
					   '<button onclick="goToInternshipPage(this)">Internship Page</button>' +
					   '</li>');
		}
		else if(internships[i].active == 1)
		{
			activeInternships++;
			$('#internshipHolder #allInternships').after('<li id="' + internships[i]._id +
					   '" class="allInternships miniAccount hidden"' +
					   '>Company: ' + internships[i].company +
						'<button onclick="handleInternship(this, false)">Suspend</button>' +
					   '<button onclick="goToInternshipPage(this)">Internship Page</button>' +
					   '</li>');
		}
	}
	$('#numOfPendingInternships').html(pendingInternships);
	$('#pendingInternships').html("Pending Internships (" + pendingInternships + ")" + "<span class='expanded'>+</span>");

	$('#numOfListedInternships').html(activeInternships);
	$('#allInternships').html("Accepted Internships (" + activeInternships + ")" + "<span class='expanded'>+</span>");


	var pendingMentorships = 0;
	var activeMentorships = 0;
	for(var i = 0; i < mentorships.length; i++)
	{
		if(mentorships[i].active == 0)
		{
			pendingMentorships++;
			$('#mentorshipHolder #pendingMentorships').after('<li id="' + mentorships[i]._id +
					   '" class="pendingMentorships miniAccount hidden"' +
					   '>Company: ' + mentorships[i].company +
						'<button onclick="handleMentorship(this, false)">Decline</button>' +
						'<button onclick="handleMentorship(this, true)">Accept</button>' +
					   '<button onclick="goToMentorshipPage(this)">Mentorship Page</button>' +
					   '</li>');
		}
		else if(mentorships[i].active == 1)
		{
			activeMentorships++;
			$('#mentorshipHolder #allMentorships').after('<li id="' + mentorships[i]._id +
					   '" class="allMentorships miniAccount hidden"' +
					   '>Company: ' + mentorships[i].company +
					   '<button onclick="goToMentorshipPage(this)">Mentorship Page</button>' +
						 '<button onclick="handleMentorship(this, false)">Suspend</button>' +
					   '</li>');
		}
	}
	$('#numOfPendingMentorships').html(pendingMentorships);
	$('#pendingMentorships').html("Pending Mentorships (" + pendingMentorships + ")" + "<span class='expanded'>+</span>");
	$('#numOfListedMentorships').html(activeMentorships);
	$('#allMentorships').html("Accepted Mentorships (" + activeMentorships + ")" + "<span class='expanded'>+</span>");
}

function show(source)
{
	console.log("showing: " + source);
	$('.miniAccount').addClass('hidden');
	if($('#' + source + " > span").html() == "+")
	{
		$('.expanded').html('+');

		$('#' + source + " > span").html("-");
		$('.' + source).removeClass('hidden');
	}
	else
	{
		$('.expanded').html('+');
	}

}

function returnToSite()
{
	window.location.href = "home.html";
}

function handleAccount(param, handle)
{
	let parentElement = $(param).parents()[0];
	if(parentElement == null) { alert('Something has gone wrong!'); return;}

	let mesg = handle ? "ACCEPT": "DECLINE";
	let accountId = $(parentElement).attr('id');
	console.log(accountId);
	if(confirm('Are you sure that you want to ' +
					mesg + ' this ACCOUNT?'))
	{
		$.ajax({
			type: 'POST',
			url: '/ToggleUser',
			contentType: 'application/json',
			data: JSON.stringify({
				'action': 'acceptOrDenyAccount',
				'accountId': accountId,
				'accepted': handle,
			}),
			complete: function(data) {
				if(data.responseText == '') {alert('Something has gone wrong!'); return;}
				else {
					alert('Account ' + mesg + "ED");
					window.location.href = "admin.html?&id=account";
				}
			},
		});
	}
}

function handleMentorship(param, handle)
{
	var parentElement = $(param).parents()[0];
	if(parentElement == null) { alert('Something has gone wrong!'); return;}

	var mesg = handle ? 'ACCEPT': 'DECLINE';
	var accountId = $(parentElement).attr('id');
	console.log(accountId);
	if(confirm('Are you sure that you want to ' +
			 mesg + ' this MENTORSHIP?'))
	{
		$.ajax({
			type: 'POST',
			url: '/ToggleMentorship',
			contentType: 'application/json',
			data: JSON.stringify({
				'action': 'acceptOrDenyMentorship',
				'mentorshipId': accountId,
				'accepted': handle,
			}), complete: function(data) {
				if(data.responseText == '') {alert('Something has gone wrong!'); return;}
				else
				{
					alert('Mentorship ' + mesg + "ED");
					window.location.href = "admin.html?&id=mentorship";
				}
			},
		});
	}
}

function handleInternship (param, handle) {
	var parentElement = $(param).parents()[0];
	if(parentElement == null) { alert('Something has gone wrong!'); return;}

	var mesg = handle ? 'ACCEPT': 'DECLINE';
	var accountId = $(parentElement).attr('id');
	if(confirm('Are you sure that you want to ' +
			 mesg + ' this INTERNSHIP?'))
	{
		$.ajax({
			type: 'POST',
			url: '/ToggleInternship',
			contentType: 'application/json',
			data: JSON.stringify({
				'action': 'acceptOrDenyInternship',
				'internshipId': accountId,
				'accepted': handle,
			}), complete: function (data) {
				if(data.responseText == '') {alert('Something has gone wrong!'); return;}
				else {
					alert('Internship ' + mesg + "ED");
					window.location.href = "admin.html?&id=internship";
				}
			},
		});
	}
}

function goToAccountPage(param)
{
	comingSoon(param);
}

function goToMentorshipPage(param)
{
	if($(param).parents('li').length == 1)
		window.location.href = 'mentorshipInfo.html?&id=' +
										$(param).parents('li').attr('id') +
										"&returnPage=" + RETURN_ID;
}

function goToInternshipPage(param)
{
	console.log($(param).parents('li'));
	if($(param).parents('li').length == 1)
		window.location.href = "internshipInfo.html?&id=" +
									$(param).parents('li').attr('id') +
									"&returnPage=" + RETURN_ID;
}

function makeRecommendation()
{

	let recommendation = $('#newRecommendation').val();
	let priority = $('#recommendationPriority').val();

	$.ajax({
		type: 'POST',
		url: '/SiteRecommendation',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'makeRecommendation',
			'recommendation': recommendation,
			'priority' : priority
		}), complete: function (data) {
			if(data.responseText == 'RECOMMENDATION_SAVED'){
				alert("Recommendation saved to database");
			} else {
				alert("Recommendation was not saved! Please try again.");
			}
		},
	});
}

function getRecommendations()
{

	$.ajax({
		type: 'POST',
		url: '/SiteRecommendation',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getRecommendations',
		}), complete: function (data) {
			console.log("Recommendation Data = ", data);
			recommendations = data.responseJSON;
			fillRecommendations();
			console.log("RECOMMENDATIONS_RETRIEVED");
		},
	});
}

function fillRecommendations()
{
	for(var i = 0; i < recommendations.length; i++) {
		let row = document.createElement('tr');
		let num = document.createElement('td');
		let content = document.createElement('td');
		let priority = document.createElement('td');

		num.innerHTML = i + 1;
		content.innerHTML = recommendations[i].content;
		priority.innerHTML = recommendations[i].priority;

    row.appendChild(num);
		row.appendChild(content);
		row.appendChild(priority);
		$('#recommendationsTableBody').append(row);
	}
}

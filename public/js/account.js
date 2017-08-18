'use strict';
let account = undefined;
let accounts = undefined;
let selected = undefined;
let interests = undefined;
let internshipRoles = undefined;
let mentorshipRoles = undefined;


function preparePage() {
	if(account.email != "root") $(".adminContent").hide();
	if(account.role == "student") {
		$(".advisorContent").hide();
		fillAboutMeStudent();
	}
	if(account.role == "advisor") {
		$(".studentContent").hide();
		document.getElementById("interestsOrCareer").innerHTML = "Your Career";
		document.getElementById("saveInterestsButton").innerHTML = "Save Selected Fields";
		fillAboutMeAdvisor();

	}

}



function getAccount () {
	$.ajax({
		type: 'POST',
		url: '/GetUser',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getUserAccount',
		}), complete: function (data) {
			console.log(data.responseJSON);
			if(data.responseText == '') {returnToLogin(); return;}
			account = data.responseJSON;
			preparePage();
			if(account.role == "student") fillMatchingAdvisors();
			fillInformation(data.responseJSON);
			getInterests();
		},
	});
}

function getAccounts () {
	$.ajax({
		type: 'POST',
		url: '/GetAccounts',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getAccounts',
		}), complete: function (data) {
			console.log(data.responseJSON);
			if(data.responseText == '') {returnToLogin(); return;}
			accounts = data.responseJSON;
			getAccount();
		},
	});
}

function fillMatchingAdvisors() {
	let matchingAdvisors = new Array();

  let matched = false;
	let t0 = new Date().getTime();
	for(var i = 0; i < accounts.length; i++) {
		if(account.email == accounts[i].email) continue;
		if(accounts[i].role == "student") continue;
		matched = false;
		for(var q = 0; q < account.interests.length; q++) {		 //Dont want to match with yourself...
			for(var k = 0; k < accounts[i].interests.length; k++) { //Well maybe you do
				if(accounts[i].interests[k] == account.interests[q] && !matched){
						matchingAdvisors.push(accounts[i]);
						matched = true;
					}
			}
		}
	}
  let t1 = new Date().getTime();
	let delta = t1 - t0;
	console.log("Matching Advisors Took: ", delta);
	console.log("Matching Advisors == ", matchingAdvisors);
	fillMatchingAdvisorsTable(matchingAdvisors);
}

function fillMatchingAdvisorsTable(matchingAdvisors) {
	if(matchingAdvisors.length)
	{
		for(var i = 0; i < matchingAdvisors.length; i++) {
			let row = document.createElement('tr');
			let name = document.createElement('td');
			let company = document.createElement('td');
			let jobTitle = document.createElement('td');

			name.innerHTML = matchingAdvisors[i].firstName + " " + matchingAdvisors[i].lastName;
			company.innerHTML = matchingAdvisors[i].company;
			jobTitle.innerHTML = matchingAdvisors[i].jobTitle;

      row.appendChild(name);
			row.appendChild(company);
			row.appendChild(jobTitle);

			$('#matchingAdvisorsTable').find('tbody').append(row);
		}
	}
	else
	{
		let row = document.createElement('tr');
		let message = document.createElement('td');
		message.innerHTML = "No Matches!";
		row.appendChild(message);
		$('#matchingAdvisorsTable').find('tbody').append(row);
	}

}



function getMentorships () {
	$.ajax({
		type: 'POST',
		url: '/GetSubscribedMentorships',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getSubscribedMentorships',
		}), complete: function (data) {
			console.log(data.responseJSON);
			getInternships();
			if(data.responseJSON) {
				fillMentorshipTable(data.responseJSON.mentorships);
			}
		},
	});
}



function getInternships() {
	$.ajax({
		type: 'POST',
		url: '/GetSubscribedInternships',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getSubscribedInternships',
		}), complete: function (data) {
			console.log(data.responseJSON);
			getInternshipRoles();
			if(data.responseJSON) {
				fillInternshipTable(data.responseJSON.internships);

			}
		},
	});
}

function getInterests() {
	$.ajax({
		type: 'POST',
		url: '/GetInterests',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getInterests',
		}), complete: function (data) {
			if(data.responseJSON) {
			console.log("Interests have been retrieved");
			interests = data.responseJSON;
			setGeneralInterestsHeader();
			initializeInterests();
			fillTier1Interests();
			getMentorships();
		}
		},
	});
}

function getInternshipRoles() {
	$.ajax({
		type: 'POST',
		url: '/GetRoles',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getInternshipRoles',
		}), complete: function (data) {
			if(data.responseJSON) {
			console.log("Internship Roles have been retrieved");
			internshipRoles = data.responseJSON;
			console.log("Internship Roles == ", internshipRoles);
			if(account.role == "advisor") {
			initializeInternshipRoles();
			fillInternshipRolesTable(internshipRoles);
		}
			getMentorshipRoles();
		}
		},
	});
}

function getMentorshipRoles() {
	$.ajax({
		type: 'POST',
		url: '/GetRoles',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getMentorshipRoles',
		}), complete: function (data) {
			if(data.responseJSON) {
			console.log("Mentorship Roles have been retrieved");
			mentorshipRoles = data.responseJSON;
			if(account.role == "advisor") {
			initializeMentorshipRoles();
			fillMentorshipRolesTable();
		}
			console.log("Mentorship Roles == ", mentorshipRoles);
		}
		},
	});
}



function fillMentorshipTable (mentorships) {
	for (let i = 0; i < mentorships.length; i++) {
		$('#mentorshipTable').append('<tr id="mentorship-' + mentorships[i]._id + '" class="mentorship" onclick="expandRow(this)">' +
															'<td>' + mentorships[i].title + '</td>' +
															'<td>' + mentorships[i].company + '</td>' +
															'<td>' + mentorships[i].location + '</td>' +
															'<td>' + mentorships[i].focus + '</td>' +
															'<td>' + mentorships[i].description +
															'</tr>');
	}
}

function fillInternshipTable (internships) {
	for (let i = 0; i < internships.length; i++) {
		$('#internshipTable').append('<tr id="internship-' + internships[i]._id + '" class="internship" onclick="expandRow(this)">' +
															'<td>' + internships[i].title + '</td>' +
															'<td>' + internships[i].company + '</td>' +
															'<td>' + internships[i].location + '</td>' +
															'<td>' + internships[i].focus + '</td>' +
															'<td>' + internships[i].description +
															'</tr>');
	}
}

function fillInternshipRolesTable () {
	for (let i = 0; i < internshipRoles.length; i++) {
		let row = document.createElement('tr');
		let element1 = document.createElement('td');
		let element2 = document.createElement('td');
		let name = document.createElement('span');
		let check = document.createElement('span');
		row.id = "internship-role-"+internshipRoles[i].id;
		row.checked = false;
		if(account.internshipRoles){
			for(var k = 0; k < account.internshipRoles.length; k++) {
				if(internshipRoles[i].id == account.internshipRoles[k]) row.checked = true;
			}
	 }
		row.onclick = function() {
			let tmp = this.id.replace("internship-role-","");
			let checkSpan = $('#'+this.id).find('#'+tmp);
			for(var i = 0; i < internshipRoles.length; i++){
					if(internshipRoles[i].id == tmp) {
						if(this.checked == true) {
							internshipRoles[i].checked = false;
							this.checked = false;
							console.log(this.id);
						}
						else {
							internshipRoles[i].checked = true;
							this.checked = true;
							console.log(this.id);
						}
				}
			}
			toggleCheck(checkSpan[0]);
		};
		row.className = "internshipRoles";
		name.innerHTML = "&nbsp;&nbsp;&nbsp;" + internshipRoles[i].name
		check.id = internshipRoles[i].id;
		if(row.checked == true) check.className = "glyphicon glyphicon-ok-sign roleCheck";
		else check.className = "glyphicon glyphicon-unchecked roleCheck";
		check.checked = row.checked;
		element1.appendChild(name);
		element2.appendChild(check);
		row.appendChild(element2);
		row.appendChild(element1);
		$('#internshipRolesTableBody').append(row);
	}
}



function fillMentorshipRolesTable () {
	for (let i = 0; i < mentorshipRoles.length; i++) {
		let row = document.createElement('tr');
		let element1 = document.createElement('td');
		let element2 = document.createElement('td');
		let name = document.createElement('span');
		let check = document.createElement('span');
		row.id = "mentorship-role-"+mentorshipRoles[i].id;
		row.checked = false;
		if(account.mentorshipRoles) {
			for(var k = 0; k < account.mentorshipRoles.length; k++) {
				if(mentorshipRoles[i].id == account.mentorshipRoles[k]) row.checked = true;
			}
	  }
		row.onclick = function() {
			let tmp = this.id.replace("mentorship-role-","");
			let checkSpan = $('#'+this.id).find('#'+tmp);
			for(var i = 0; i < mentorshipRoles.length; i++){
					if(mentorshipRoles[i].id == tmp) {
						if(this.checked == true) {
							mentorshipRoles[i].checked = false;
							this.checked = false;
						}
						else {
							mentorshipRoles[i].checked = true;
							this.checked = true;
						}
				}
			}
			toggleCheck(checkSpan[0]);
		};
		row.className = "mentorshipRoles";
		name.innerHTML = "&nbsp;&nbsp;&nbsp;" + mentorshipRoles[i].name
		check.id = mentorshipRoles[i].id;
		if(row.checked == true) check.className = "glyphicon glyphicon-ok-sign roleCheck";
		else check.className = "glyphicon glyphicon-unchecked roleCheck";
		check.checked = row.checked;
		element1.appendChild(name);
		element2.appendChild(check);
		row.appendChild(element2);
		row.appendChild(element1);
		$('#mentorshipRolesTableBody').append(row);
	}
}

function expandRow(src) {
	console.log(src);
	selected = $(src).attr('id');
	$('.infoRow').remove();
	$('.internship').removeClass('highlighted');
	$('.mentorship').removeClass('highlighted');
	$(src).addClass('highlighted');
	if ($(src).hasClass('mentorship')) {
		$(src).after('<tr class="infoRow">' +
									'<td style="display:none"><button class="btn btn-default" onclick="goToMentorshipPage()">Mentorship Page</button></td>' +
									'<td style="display:none"></td>' +
									'<td style="display:none"></td>' +
									'<td style="display:none"></td>' +
									'<td style="display:none"><button class="btn btn-danger" onclick="unsubscribeMentorship()">Unsubscribe</button></td>' +
									'</tr>');
		$('.infoRow > td').slideDown();
	} else if ($(src).hasClass('internship')) {
		$(src).after('<tr class="infoRow">' +
									'<td style="display:none"><button class="btn btn-default" onclick="goToInternshipPage()">Internship Page</button></td>' +
									'<td style="display:none"></td>' +
									'<td style="display:none"></td>' +
									'<td style="display:none"></td>' +
									'<td style="display:none"><button class="btn btn-danger" onclick="unsubscibeInternship()">Unsubscribe</button></td>' +
									'</tr>');
		$('.infoRow > td').slideDown();
	}
}

function fillInformation (json) {
	$('#name').html(json.firstName + ' ' + json.lastName);
	$('#email').html(json.email);
	$('#status').html(toTitleCase(json.role));

}

function unsubscibeInternship () {
	console.log(selected);
	if (typeof selected === 'undefined') return alert('Error Getting Internship ID: Select Again');
	if (selected.includes('mentorship-')) return alert('Error Getting Internship ID: Select Again');

	$.ajax({
		type: 'POST',
		url: '/UnsubscribeFromInternship',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'unsubscribeFromInternship',
			'internshipID': selected.replace('internship-','')
		}), complete: function (data) {
			console.log(data.responseJSON);
		},
	});

}

function unsubscribeMentorship () {
	console.log(selected);
	if (typeof selected === 'undefined') alert('Error Getting Mentorship ID: Select Again');

	/*
	$.ajax({
		type: 'POST',
		url: '/GetUser',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getUserAccount',
		}), complete: function (data) {
			console.log(data.responseJSON);
			if(data.responseText == '') {returnToLogin(); return;}
			account = data.responseJSON;
			fillInformation(data.responseJSON);
			getMentorships();
		},
	});
	*/
}





function fillTier1Interests() {
	   console.log("FILL TIER 1");
			for(var i = 0; i < interests.length; i++) {
				//interests[i].checked = false;
				interests[i].expanded = false;
				if(interests[i].tier === "1"){
					//$('#interest_id_'+interests[i].interest_id).html("<span class='glyphicon glyphicon-plus'></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ interests[i].name);
          //$('#interest_id_'+interests[i].interest_id).html("<span class='glyphicon glyphicon-ok-'></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ interests[i].name);
					if(interests[i].checked == true){
							$('#interest_id_'+interests[i].interest_id).html("<span id='interest_id_"+interests[i].interest_id+"_check'" + "class='glyphicon glyphicon-ok-sign'></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ interests[i].name);
              document.getElementById('interest_id_'+interests[i].interest_id+'_check').checked = true;
					}
					else {
					     $('#interest_id_'+interests[i].interest_id).html("<span id='interest_id_"+interests[i].interest_id+"_check'" + "class='glyphicon glyphicon-unchecked'></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ interests[i].name);
							 document.getElementById('interest_id_'+interests[i].interest_id+'_check').checked = false;
						 }
					//document.getElementById('interest_id_'+interests[i].interest_id+'_check').checked = true;
					//console.log("WEIRD THING ", $('#interest_id_'+interests[i].interest_id+'_check'));

					$('#interest_id_'+interests[i].interest_id+"_expand").removeClass("glyphicon-plus-sign");
					$('#interest_id_'+interests[i].interest_id+"_expand").addClass("glyphicon-plus-sign");
					$('#interest_id_'+interests[i].interest_id+'_check').click(function() {
						let tmp = this.id.replace("interest_id_", "");
						tmp = tmp.replace("_check","");
						for(var i = 0; i < interests.length; i++){
								if(interests[i].interest_id == tmp) {
									if(this.checked == true) interests[i].checked = false;
									else interests[i].checked = true;
							}
						}
						toggleCheck(this);
					});
				}
			}
}



function clearInterestDisplay(){

	$('#interestDisplayTable').find('tr').remove();
	$('#interestDisplay').find('li').remove();


}

function setGeneralInterestsHeader() {
	$('#userInterests').find('h2').remove();
	$('#interestDisplayHead').find('ul').remove();
	$('#interestDisplayHead').find('table').remove();

	let header_1 = document.createElement('h2');
	let header_2 = document.createElement('h2');
	header_1.class = "generalInterestHead";
	header_2.class = "generalInterestHead";
	header_1.style = "color: white";
	header_2.style = "color: white";

	if(account.role == "advisor") {
		header_1.innerHTML = "Select the fields that purtain to your career!";
		$('#interestDisplayHead').after(header_1);
	}
	else  {
		header_1.innerHTML = "Pick what areas you're interested in!";
	  header_2.innerHTML = "General Interests";
		$('#interestDisplayHead').after(header_2);
		$('#interestDisplayHead').after(header_1);
	}



}

function setInterestDisplayHeader(parent_interest){
	$('#interestDisplayHead').find('h2').remove();
	$('#userInterests').find('h2').remove();
	$('#interestDisplayHead').find('ul').remove();
	$('#interestDisplayHead').find('table').remove();

	console.log("PARENTT ", parent_interest);
  let parent;
  for(var i = 0; i < interests.length; i++){
		if(interests[i].parent_interest_id == parent_interest.parent_interest_id &&
		    interests[i].interest_id == parent_interest.interest_id) parent = interests[i];
	}
		console.log("PARENTTZZZ ", parent);
  let table = document.createElement('table');
	table.id = "interestDisplayHead";
	let row = document.createElement('row');
	let element_1 = document.createElement('td');
	let element_2 = document.createElement('td');
	let span = document.createElement('span');
	let title = document.createElement('span');

	let list = document.createElement('ul');
	list.className = 'list-group';

	let item_name = document.createElement('li');
	item_name.id = "interest_id_"+parent_interest.interest_id;
	item_name.className ="list-group-item";
	span.id = "interest_id_"+parent_interest.interest_id+"_check";
	span.value = parent_interest.interest_id;
	span.checked = parent_interest.checked;
	if(span.checked == true){
		span.className = 'glyphicon glyphicon-ok-sign';
	} else {
		span.className = 'glyphicon glyphicon-unchecked';
	}

		let item_expand = document.createElement('li');

		let expand = document.createElement('span');
		item_expand.className = "list-group-item";
		expand.id = parent_interest.interest_id;
	  expand.className = "glyphicon glyphicon-minus-sign";
		expand.onclick = function() {
				displayTierAboveParent(parent);
		};
		span.onclick = function() {
			for(var i = 0; i < interests.length; i++){
				let tmp = this.id.replace("interest_id_","");
				tmp = tmp.replace("_check","");
					if(interests[i].interest_id == tmp) {
						if(this.checked == true) interests[i].checked = false;
						else interests[i].checked = true;
				}
			}
			toggleCheck(this);
		};
		if(parent_interest.checked == true){
			span.checked = true;
			title.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+parent_interest.name;
		}
		else {
			span.checked = false;
			title.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + parent_interest.name;
		}



		item_expand.appendChild(expand);
		item_name.appendChild(span);
		item_name.appendChild(title);

		element_1.appendChild(item_name);
		element_2.appendChild(item_expand);

		row.appendChild(element_1);
		row.appendChild(element_2);
		//row.appendChild(list);

		table.appendChild(row);
		$('#interestDisplayHead').after(table);
		//$(span).after('#interest_id_'+parent_interest.interest_id)
}

function displayTierAboveParent(parent_interest){
	console.log("DISPLAY TIER ABOVE PARENT", parent_interest);
	var count = 0;
  var i = 0;
  let new_parent;
	for(; i < interests.length; i++) {
    if(parent_interest.parent_interest_id){
			if(interests[i].interest_id == parent_interest.parent_interest_id) new_parent = interests[i];
		}
		if(!parent_interest.parent_interest_id && !interests[i].parent_interest_id){
			if(count == 0) {
				clearInterestDisplay();
				setGeneralInterestsHeader();
			}
			count ++;
			let row = document.createElement('tr');
			let element_1 = document.createElement('td');
			let element_2 = document.createElement('td');


			let interest_name = document.createElement('li');
			let interest_expand = document.createElement('li');
			let span = document.createElement('span');
			let title = document.createElement('span');


			//let interest_id = interests[i].interest_id;


			if(interests[i].checked == true){
				span.checked = true;
				title.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+interests[i].name;
			}
			else {
				span.checked = false;
				title.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + interests[i].name;
			}

			interest_name.id = "interest_id_"+interests[i].interest_id;

			interest_name.className ="list-group-item";
			interest_expand.className = "list-group-item";
			let expand = document.createElement('span');
			expand.id = interests[i].interest_id;

			expand.onclick = function() {
					displaySubinterests(this.id);
			};
			if(checkChildInterests(interests[i].interest_id) == true) {
				expand.className = 'glyphicon glyphicon-plus-sign';
			}

			span.id = "interest_id_"+interests[i].interest_id+"_check";
      span.value = interests[i].interest_id;
			span.checked = interests[i].checked;
			if(span.checked == true){
				span.className = 'glyphicon glyphicon-ok-sign';
			} else {
				span.className = 'glyphicon glyphicon-unchecked';
			}
			span.onclick = function() {
				for(var i = 0; i < interests.length; i++){
						if(interests[i].interest_id == this.value) {
							if(this.checked == true) interests[i].checked = false;
							else interests[i].checked = true;
					}
				}
				toggleCheck(this);
			};

      interest_expand.appendChild(expand);
      interest_name.appendChild(span);
			interest_name.appendChild(title);
			element_1.appendChild(interest_name);
			element_2.appendChild(interest_expand);

			row.appendChild(element_1);
			row.appendChild(element_2);

			$('#interestDisplayTable').append(row);
		}
		else if(!parent_interest.parent_interest_id && interests[i].parent_interest_id) continue;
		else if(parent_interest.parent_interest_id && !interests[i].parent_interest_id) continue;
		else if(interests[i].parent_interest_id && parent_interest.parent_interest_id){
			if(interests[i].parent_interest_id != parent_interest.parent_interest_id) continue;
			else {
				if(count == 0) {
					clearInterestDisplay();
					setInterestDisplayHeader(new_parent)
				}
				count ++;
				let row = document.createElement('tr');
				let element_1 = document.createElement('td');
				let element_2 = document.createElement('td');

				let interest_name = document.createElement('li');
				let interest_expand = document.createElement('li');
				let span = document.createElement('span');
				let title = document.createElement('span');


				if(interests[i].checked == true){
					title.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ interests[i].name;}
				else title.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + interests[i].name;


				interest_name.id = "interest_id_"+interests[i].interest_id;
				interest_name.className ="list-group-item";
				interest_expand.className = "list-group-item";
				let expand = document.createElement('span');
				expand.id = parent_interest.interest_id;
				console.log("EXAPND ID = ", expand.id);
				expand.onclick = function() {
						displaySubinterests(this.id);
				};
				if(checkChildInterests(interests[i].interest_id) == true) {
					expand.className = 'glyphicon glyphicon-plus-sign';
				}

				span.id = "interest_id_"+interests[i].interest_id+"_check";
				span.value = interests[i].interest_id;
				span.checked = interests[i].checked;
				if(span.checked == true){
					span.className = 'glyphicon glyphicon-ok-sign';
				} else {
					span.className = 'glyphicon glyphicon-unchecked';
				}
				span.onclick = function() {
					for(var i = 0; i < interests.length; i++){
							if(interests[i].interest_id == this.value) {
								if(this.checked == true) interests[i].checked = false;
								else interests[i].checked = true;
						}
					}
					toggleCheck(this);
				};

				interest_expand.appendChild(expand);
	      interest_name.appendChild(span);
				interest_name.appendChild(title);
				element_1.appendChild(interest_name);
				element_2.appendChild(interest_expand);

				row.appendChild(element_1);
				row.appendChild(element_2);

				$('#interestDisplayTable').append(row);
			}

		}
	}
}


function displaySubinterests(parent_interest_id) {

		console.log("PARENT_INTEREST_ID = ", parent_interest_id);


		var count = 0;
		var i = 0;
		let parent_interest;
		for(; i < interests.length; i++) {
			if(interests[i].interest_id == parent_interest_id) parent_interest = interests[i];
			else if(!interests[i].parent_interest_id) continue;
			else if(interests[i].parent_interest_id != parent_interest_id) continue;
			else {
				if(count == 0) clearInterestDisplay();
				count ++;
				let row = document.createElement('tr');
				let element_1 = document.createElement('td');
				let element_2 = document.createElement('td');


				let interest_name = document.createElement('li');
				let interest_expand = document.createElement('li');
				let span = document.createElement('span');
				let title = document.createElement('span');

				//let interest_id = interests[i].interest_id;

				if(checkChildInterests(interests[i].interest_id) == true) {
					interest_expand.className = 'list-group-item glyphicon glyphicon-plus-sign';
				}


				interest_name.id = "interest_id_"+interests[i].interest_id;

				interest_name.className ="list-group-item";
				interest_expand.className = "list-group-item";
				let expand = document.createElement('span');
				expand.id = interests[i].interest_id;
				/*
				expand.onclick = function() {
						displayTierAboveParent(parent_interest);
				};
				*/

				expand.onclick = function (){
					let interest_id = this.id.replace("interest_id_","");
					displaySubinterests(interest_id);
				};
				if(checkChildInterests(expand.id)){
					expand.className = 'glyphicon glyphicon-plus-sign';
				}
				span.id = "interest_id_"+interests[i].interest_id+"_check";
				span.value = interests[i].interest_id;
				span.checked = interests[i].checked;
				if(span.checked == true){
					span.className = 'glyphicon glyphicon-ok-sign';
				} else {
					span.className = 'glyphicon glyphicon-unchecked';
				}

				span.onclick = function() {
					for(var i = 0; i < interests.length; i++){
							if(interests[i].interest_id == this.value) {
								if(this.checked == true) interests[i].checked = false;
								else interests[i].checked = true;
						}
					}
					toggleCheck(this);
				};
				if(interests[i].checked == true){
					title.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ interests[i].name;}
				else title.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + interests[i].name;


				interest_name.appendChild(span);
				interest_name.appendChild(title);
				interest_expand.appendChild(expand);
				element_1.appendChild(interest_name);
				element_2.appendChild(interest_expand);

				row.appendChild(element_1);
				row.appendChild(element_2);

				$('#interestDisplayTable').append(row);
			}
		}
		if(count != 0) setInterestDisplayHeader(parent_interest);


}

function checkChildInterests(interest_id){
			for(var i = 0; i < interests.length; i++) {
				if(interests[i].parent_interest_id == interest_id) return true;

			}
			return false;
}

function saveAboutMe(){

	account.personalBio = $('#aboutMeTable').find('#personalBio').val();
	account.company = $('#aboutMeTable').find('#company').val();
	account.jobTitle = $('#aboutMeTable').find('#jobTitle').val();

	$.ajax({
		type: 'POST',
		url: '/SaveUser',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'saveAboutMe',
			'email': account.email,
			'personalBio' : account.personalBio,
			'company' : account.company,
			'jobTitle': account.jobTitle
		}), complete: function (data) {
			console.log(data);
		},
	});
}

function saveInterests(){
	account.interests = new Array();
	for(var i = 0; i < interests.length; i++) {
		if(interests[i].checked == true) {
			console.log("INTEREST ID : ", interests[i].interest_id);
			account.interests.push(interests[i].interest_id);
	}
}
	$.ajax({
		type: 'POST',
		url: '/SaveUser',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'saveUserInterests',
			'email': account.email,
			'interests' : account.interests
		}), complete: function (data) {
			console.log(data);
		},
	});

}

function saveInternshipRoles(){
	account.internshipRoles = new Array();
	for(var i = 0; i < internshipRoles.length; i++) {
		if(internshipRoles[i].checked == true) {
			console.log("INTEREST ID : ", internshipRoles[i].id);
			account.internshipRoles.push(internshipRoles[i].id);
	}
}
	$.ajax({
		type: 'POST',
		url: '/SaveUser',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'saveUserInternshipRoles',
			'email': account.email,
			'internshipRoles' : account.internshipRoles
		}), complete: function (data) {
			console.log(data);
		},
	});

}

function saveMentorshipRoles(){
	account.mentorshipRoles = new Array();
	for(var i = 0; i < mentorshipRoles.length; i++) {
		if(mentorshipRoles[i].checked == true) {
			console.log("INTEREST ID : ", mentorshipRoles[i].id);
			account.mentorshipRoles.push(mentorshipRoles[i].id);
	}
}
	$.ajax({
		type: 'POST',
		url: '/SaveUser',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'saveUserMentorshipRoles',
			'email': account.email,
			'mentorshipRoles' : account.mentorshipRoles
		}), complete: function (data) {
			console.log(data);
		},
	});

}

function sendAlerts() {
console.log("IN SEND ALERTS");
	$.ajax({
		type: 'POST',
		url: '/SendAlerts',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'updatedQuestionAndAnswer',
			'account': account,
			'interests' : interests
		}), complete: function (data) {
			console.log(data);
		}
	});
}

function savePreferences(){
	account.questionAndAnswer = document.getElementById('QuestionAndAnswerCheck').checked;
	if(account.questionAndAnswer == true) account.questionAndAnswer = "true";
	else account.questionAndAnswer = "false";

	if(account.role == "advisor" && account.questionAndAnswer == "true")  sendAlerts();

	$.ajax({
		type: 'POST',
		url: '/SaveUser',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'saveUserPreferences',
			'email': account.email,
			'questionAndAnswer' : account.questionAndAnswer
		}), complete: function (data) {
			console.log(data);
		}
	});

}

function initializeInterests() {

	for(var i = 0; i < interests.length; i++) {
		interests[i].checked = false;
		if(document.getElementById('interest_id_'+interests[i].interest_id+"_check")){
		document.getElementById('interest_id_'+interests[i].interest_id+"_check").checked = false;
	  }
		if(!account.interests) continue;
		for(var q = 0; q < account.interests.length; q++) {
			if(account.interests[q] == interests[i].interest_id){
				if(document.getElementById('interest_id_'+interests[i].interest_id+"_check")){
				document.getElementById('interest_id_'+interests[i].interest_id+"_check").checked = false;
			  }
			 		interests[i].checked = true;
				}
		}
	}

}

function initializeInternshipRoles() {
	console.log("ACC = ", account);
	if(!account.internshipRoles) return;
	for(var i = 0; i < internshipRoles.length; i++) {
		internshipRoles[i].checked = false;
		for(var q = 0; q < account.internshipRoles.length; q++){
			if(internshipRoles[i].id == account.internshipRoles[q])
			       internshipRoles[i].checked = true;
		}
	}
}

function initializeMentorshipRoles() {
	console.log("ACC = ", account);
	if(!account.mentorshipRoles) return;
	for(var i = 0; i < mentorshipRoles.length; i++) {
		mentorshipRoles[i].checked = false;
		for(var q = 0; q < account.mentorshipRoles.length; q++){
			if(mentorshipRoles[i].id == account.mentorshipRoles[q])
			       mentorshipRoles[i].checked = true;
		}
	}
}


function toggleCheck(elem) {
	console.log("THIS = ", elem.checked);

	if(elem.checked == false || elem.checked == 'false'){
		elem.className = "glyphicon glyphicon-ok-sign";
		elem.checked = true;
	} else {
    elem.className = "glyphicon glyphicon-unchecked";
		elem.checked = false;
	}
}

function fillAboutMeAdvisor() {
	$('#aboutMeTable').find('tr').remove();
	let table = document.getElementById('aboutMeTable');
	let row1 = document.createElement('tr');
	let row2 = document.createElement('tr');
  let row3 = document.createElement('tr');


  let bioLabel = document.createElement('td');
	bioLabel.innerHTML = "Personal Bio:";
	bioLabel.style.color = "white";
	let personalBio = document.createElement('td');
	let textBox = document.createElement('textarea');
	textBox.id = "personalBio";
	textBox.rows = "4";
	textBox.cols = "30";

	let brk = document.createElement('br');
	let companyLabel = document.createElement('td');
	companyLabel.innerHTML = "Company:";
	companyLabel.style.colr = "white";
	let company = document.createElement('td');
	let companyInput = document.createElement('input');
	companyInput.id = "company";
	companyInput.type = "text";

  let brk2 = document.createElement('br');
	let jobTitleLabel = document.createElement('td');
	jobTitleLabel.innerHTML = "Title:";
	jobTitleLabel.style.color = "white";
	let jobTitle = document.createElement('td');
	let jobTitleInput = document.createElement('input');
	jobTitleInput.id = "jobTitle";
	jobTitleInput.type = "text";

	if(account.personalBio) textBox.innerHTML = account.personalBio;
	if(account.company) companyInput.value = account.company;
	if(account.jobTitle) jobTitleInput.value = account.jobTitle;


	row1.appendChild(bioLabel);
	personalBio.appendChild(textBox);
	row1.appendChild(personalBio);

  row2.appendChild(companyLabel);
	company.appendChild(companyInput);
  row2.appendChild(company);

	row3.appendChild(jobTitleLabel);
	jobTitle.appendChild(jobTitleInput);
	row3.appendChild(jobTitle);


	$('#aboutMeTable').append(row1);
	$('#aboutMeTable').append(brk);
	$('#aboutMeTable').append(row2);
	$('#aboutMeTable').append(brk2);
	$('#aboutMeTable').append(row3);
}

function fillAboutMeStudent() {
	$('#aboutMeTable').find('tr').remove();
	let table = document.getElementById('aboutMeTable');
	let row1 = document.createElement('tr');

	let bioLabel = document.createElement('td');
	bioLabel.innerHTML = "Personal Bio:";
	bioLabel.style.color = "white";
	let personalBio = document.createElement('td');
	let textBox = document.createElement('textarea');
	textBox.id = "personalBio";
	textBox.rows = "4";
	textBox.cols = "30";

	if(account.personalBio) textBox.innerHTML = account.personalBio;

  row1.appendChild(bioLabel);
	personalBio.appendChild(textBox);
	row1.appendChild(personalBio);

	$('#aboutMeTable').append(row1);

}

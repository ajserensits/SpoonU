let mentorships;
let selectedMentorship;

function loadMentorships () {
	var filter = getParameterByName("id");
	console.log(filter);
	$.ajax({
		type: 'POST',
		url: '/GetMentorships',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getMentorships',
			'active': 1
		}), complete: function (data) {
			console.log(data);
			if (data.responseJSON) {
				mentorships = data.responseJSON;
				fillField(data.responseJSON);
			}
		},
	});
}

function fillField (json) {
	var count = 0;
	for(var i = 0; i < json.length; i++)
	{
		if (json[i].active) {
			count++;
			$('#mentorships').append('<tr id="index' + i + '" onclick="showDetails(this)"><td>' + json[i].title + '</td>' +
																'<td>' + json[i].company + '</td>' +
																'<td>' + json[i].contact + '</td>' +
																'<td>' + toTitleCase(json[i].focus) + '</td>' +
																'</tr>');

		}
	}

	if (!count) {
		$('#mentorships').append('<tr><td>No Mentorships to Display</td></tr>');
	}
}

function showDetails (source) {
	console.log(source);
	selectedMentorship = mentorships[$(source).attr('id').replace(/\D/g,'')];
	$('.well').removeClass('hidden');
	$('.well > .mentorshipTitle').text(selectedMentorship.title);
}

function subscribe() {
	$.ajax({
		type: 'POST',
		url: '/SubscribeToMentorship',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'subscribeToMentorship',
			'mentorshipID': selectedMentorship._id
		}), complete: function (data) {
			console.log(data);
			if (data.responseText === 'SUBSCRIBED') {
				alert('Subscribed!');
			} else if (data.responseText === 'ALREADY_SUBSCRIBED') {
				alert('Already Subscribed!');
			} else {
				alert('Subscription Request Failed!');
			}
		},
	});
}

let internships;
let selectedInternship;

function loadInternships () {
	var filter = getParameterByName("id");

	$.ajax({
		type: 'POST',
		url: '/GetInternships',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'getInternships',
		}), complete: function(data) {
			console.log(data);
			if (data.responseJSON) {
				internships = data.responseJSON;
				fillField(data.responseJSON);
			}
		}
	});
}

function fillField (json) {
	var count = 0;
	for (var i = 0; i < json.length; i++) {
		if (json[i].active) {
			count++;
			$('#internships').append('<tr  id="index' + i + '" onclick="showDetails(this)"><td>' + json[i].title + '</td>' +
																'<td>' + json[i].company + '</td>' +
																'<td>' + json[i].contact + '</td>' +
																'<td>' + toTitleCase(json[i].focus) + '</td>' +
																'</tr>');
		}
	}

	if (!count) {
		$('#internships').append('<tr><td>No Internships to Display</td></tr>');
	}
}

function showDetails (source) {
	console.log(source);
	selectedInternship = internships[$(source).attr('id').replace(/\D/g,'')];
	$('.well').removeClass('hidden');
	$('.well > .internshipTitle').text(selectedInternship.title);
}

function subscribe (internshipID) {
	$.ajax({
		type: 'POST',
		url: '/SubscribeToInternship',
		contentType: 'application/json',
		data: JSON.stringify({
			'action': 'subscribeToInternship',
			'internshipID': selectedInternship._id
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

/**
 * 	Base functions that are applicable for more than one page
 */

var focuses = ['Business', 'Finance', 'Law', 'Medicine', 'Teaching', 'Trade', 'Other'];
var navigateParam = ""

/**
 * The title bar calls navigate in order to navigate to the base page of each one
 * @param location - the name of the destination page
 */
function navigate (location) {
	switch (location) {
		case "home":
			window.location.href = "home.html";
			break;
		case "mentorships":
			window.location.href = "mentorshipBrowser.html" + navigateParam;
			break;
		case "internships":
			window.location.href = "internshipBrowser.html" + navigateParam;
			break;
		case "events":
			window.location.href = "events.html" + navigateParam;
			break;
		case "logout":
			logout();
			break;
		case "account":
			window.location.href = "account.html";
			break;
	}
}

function getParameterByName (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * The mentorship's submenu uses this to navigate with filters already in place
 * @param param - the major that the page will filter for
 */
function findMentorships (param) {
	navigateParam = "?&id=" + param;
}

/**
 * The internship's submenu uses this to navigate with filters already in place
 * @param param - the major that the page will filter for
 */
function findInternships (param) {
	navigateParam = "?&id=" + param;
}

/**
 * 	Expands tabs on the mentorship, internships, and events pages
 * 	TODO: use html classes to generalize this ie. find all children with class (.hideme) and toggle .hidden
 */
function expand (tab) {
	$(tab).siblings().children(".name").addClass("hidden");
	$(tab).siblings().removeClass('active');

	$(tab).children().removeClass("hidden");
	$(tab).addClass('active');
}


function fillFocusDropdown () {
	for(var i = 0; i < focuses.length; i++) {
		$("#focus").append($("<option></option>")
				.attr("value", focuses[i])
				.text(focuses[i]));
	}
}

function getEvents (param) {
	navigateParam = "?&id=" + param;
}

function returnToLogin () {
	if(confirm("Login Session has expired. Would you like to relogin?"))
		window.location.href = "index.html";
}

function forceReturnToLogin () {
	console.log('hey!');
	window.location.href = "index.html";
}

function openFeedbackTab () {
	window.open('feedback.html');
}

function comingSoon (param) {
	$(param).html("Coming Soon!");
}

function returnToPageID (id) {
	switch (id) {
		case '0':
			window.location.href = 'admin.html';
			break;
		default:
			alert('Return Page Undefined, Returning Home!');
			window.location.href = 'home.html';
			break;
	}
}

function returnToPreviousByURLParam () {
	var id = getParameterByName('returnPage');
	returnToPageID(id);
}

function toTitleCase (str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

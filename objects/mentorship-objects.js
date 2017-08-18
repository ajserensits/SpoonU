'use strict';
let ObjectId = require('mongodb').ObjectID;

// TODO include validator to do actual json value validating

module.exports = {

  /*
    takes json params in the form of an account
    and a session which should contain a user
    expects a callback with params (err, user_result)
  */
  createMentorshipObject : function (json, session, callback) {
    if(typeof json.title !== 'undefined' && typeof json.title === 'string') {
      if(json.title.length === 0) {
        callback({'INVALID_FORM': 'Invalid Title'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Title'}, null);
      return;
    }

    if(typeof json.location === 'string') {
      if(json.location.length === 0) {
        callback({'INVALID_FORM': 'Invalid Location'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Location'}, null);
      return;
    }

    if(typeof json.company === 'string') {
      if(json.company.length === 0) {
        callback({'INVALID_FORM': 'Invalid Company'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Company'}, null);
      return;
    }

    if (typeof json.contact === 'string') {
      if(json.contact.length === 0) {
        callback({'INVALID_FORM': 'Invalid Contact'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Contact'}, null);
      return;
    }

    if (typeof json.description === 'string') {
      if (json.description.length === 0) {
        callback({'INVALID_FORM': 'Invalid Description'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Description'}, null);
      return;
    }

    if (typeof json.focus === 'string') {
      if(json.focus.length === 0) {
        callback({'INVALID_FORM': 'Invalid Focus'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Focus'}, null);
      return;
    }

    if (typeof session.user === 'undefined') {
      callback({'INVALID_FORM': 'Invalid User Session'}, null);
    } else if (session.user.id === 'undefined') {
      callback({'INVALID_FORM': 'Invalid User Session'}, null);
    }

    let mentorship = {
      'active': 0,
      'title': json.title,
      'location': json.location,
      'company': json.company,
      'contact': json.contact,
      'description': json.description,
      'focus': json.focus,
      'posterID': new ObjectId(session.user._id),
      'subscriberIDs': []
    }
    callback(null, mentorship);
  }
};

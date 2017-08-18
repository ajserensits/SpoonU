'use strict';
//var validator = require('./validators/user')

/*
  takes json params in the form of an account
  expects a callback with params (err, user_result)
*/
module.exports = {
  createUserObject: function(json, callback) {
    let passwordHash = require('password-hash');

    if(typeof json.username !== 'undefined' && typeof json.username === 'string') {
      if(json.username.length === 0) {
        callback({'INVALID_FORM': 'Invalid Email'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Email'}, null);
      return;
    }

    if (typeof json.password !== 'undefined' && typeof json.password === 'string') {
      if(json.password.length === 0) {
        callback({'INVALID_FORM': 'Invalid Password'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Password'}, null);
    }

    if(typeof json.firstName === 'string') {
      if(json.firstName.length === 0) {
        callback({'INVALID_FORM': 'Invalid First Name'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid First Name'}, null);
      return;
    }

    if(typeof json.lastName === 'string') {
      if(json.lastName.length === 0) {
        callback({'INVALID_FORM': 'Invalid Last Name'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Last Name'}, null);
      return;
    }

    if(typeof json.status === 'string') {
      if(json.status.length === 0) {
        callback({'INVALID_FORM': 'Invalid User Status'}, null);
        return;
      }
    } else {
      callback({'INVALID_FORM': 'Invalid Role'}, null);
      return;
    }

    let user = {
      'active': 0,
      'email': json.username,
      'password': passwordHash.generate(json.password),
      'firstName': json.firstName,
      'lastName': json.lastName,
      'role': json.status.toLowerCase(),
      'company': '',
      'focus': '',
      'focusTags': '',
      'interests':''
    }
    callback(null, user);
  }
};

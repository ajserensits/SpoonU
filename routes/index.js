'use strict';

let express = require('express');
let router = express.Router();
let mongodb = require('mongodb');
let passwordHash = require('password-hash');
let Globals = require('../config');
let globals = new Globals();
let users = require('../objects/user-objects');


router.post('/Login', function (req, res, next) {
  let t0 = new Date().getTime();
  login(req.body, req.session, function(response) {
    let t1 = new Date().getTime();
    res.send(response);
    console.log('POST@/Login --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
  });
});

router.post('/Register', function (req, res, next) {
  let t0 = new Date().getTime();
  register(req.body, function (response) {
    let t1 = new Date().getTime();
    res.send(response);
    console.log('POST@/Register --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
  });
});

router.post('/Logout', function (req, res, next) {
  let t0 = new Date().getTime();
  logout(req.session, function () {
    let t1 = new Date().getTime();
    console.log('POST@/Logout --- End User Session --- ' + (t1 - t0) + 'ms');
  });
});

function login(json, session, callback) {
  if(json.action !== 'login') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    let username = json.username;
    let password = json.password;
    let MongoClient = mongodb.MongoClient;

    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@index.js.login().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('users');

        collection.find({'email': username}).toArray(function (err, result) {
          // if error, server failure
          if (err) {
            callback('SERVER_ERROR');
            db.close();
          } else if (result.length) { // else if there are users in the database
            // if there is one result
            if (result.length === 1 && result[0].email === username) {
              if (result[0].active === 0) {
                // if the account is inactive, end login process
                callback('ACCOUNT_INACTIVE');
              } else if (passwordHash.verify(password, result[0].password)) {
              //} else if (result[0].password === password) {
                // if query user password is the password, login
                if (result[0].role === 'admin') {
                  callback('LOGIN_ADMIN');
                } else {
                  callback('LOGIN_SUCCESS');
                }
                // TODO: Save in DB - user.loggedIn = true;
                // TODO: Set session as valid
                session.user = result[0];
                session.save(function (err) {
                  if (err) console.log('session error');
                });
              } else {
                // else, invalid login
                callback('INVALID_LOGIN');
              }
            } else {
              console.log('err: found multiple users with the same email!');
              callback('SERVER_ERROR');
            }
            db.close();
          } else {  // if the user is not the database (invalid id)
            callback('INVALID_LOGIN');
            db.close();
          }
        });
      }
    });
  } // end else
} // end login

function register(json, callback) {
  if(json.action !== 'register') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log(err);
        callback('SERVER_ERROR');
      } else {
        users.createUserObject(json, function(err, user) {
          if(err) {
            console.log('err@index.js:register() - ' + err);
            callback(err);
          } else {
            let collection = db.collection('users');
            collection.find({email:user.email}).toArray(function (err, result) {
              if (err) {
                callback('SERVER_ERROR');
                //db.close();
              } else if (result.length) {
                callback({'INVALID_FORM': 'Account Already Exists'});
                //db.close();
              } else {
                collection.insert([user], function (err, done) {
                  if (err) {
                    console.log('err@index.js:register() - ' + err);
                    callback('SERVER_ERROR');
                  } else {
                    callback('ACCOUNT_CREATED');
                  }
                  //db.close();
                });
              }
              db.close();
            });
          }
        }); // end createUserObject callback
      } // end MongoClient else branch
    }); // end MongoClient.connect
  } // end register else branch
}

function logout (session , callback) {
  session.destroy();
}

module.exports = router;

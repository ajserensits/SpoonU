'use strict';

var express = require('express');
var router = express.Router();
let mongodb = require('mongodb');
let ObjectId = require('mongodb').ObjectID;
let Globals = require('../config');
let globals = new Globals();
let mentorships = require('../objects/mentorship-objects');

router.post('/GetMentorships', function (req, res, next) {
  let t0 = new Date().getTime();
  getMentorships(req.body, function (response) {
    res.send(response);
    let t1 = new Date().getTime();
    console.log('POST@/GetMentorships --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
  });
});

router.post('/SubmitMentorship', function (req, res, next) {
  let t0 = new Date().getTime();
  submitMentorship(req.body, req.session, function (response) {
    res.send(response);
    let t1 = new Date().getTime();
    console.log('POST@/SubmitMentorship --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
  });
});

router.post('/SubscribeToMentorship', function (req, res, next) {
  let t0 = new Date().getTime();
  subscribeToMentorship(req.body, req.session.user, function (response) {
    res.send(response);
    let t1 = new Date().getTime();
    console.log('POST@/SubscribeToMentorship --- Response: ' + response + ' --- ' + (t1 - t0) + 'ms');
  });
});

router.post('/GetSubscribedMentorships', function (req, res, next) {
  let t0 = new Date().getTime();
  getSubscribedMentorships(req.body, req.session.user, function (response) {
    res.send(response);
    let t1 = new Date().getTime();
    console.log('POST@/GetSubscribedMentorships --- Response: ' + response + ' --- ' + (t1 - t0) + 'ms');
  });
});

function getMentorships (json, callback) {
  if (json.action !== 'getMentorships') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@mentorships.js.getAccounts().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection(globals.MENTORSHIP_TABLE);
        collection.find().toArray(function (err, results) {
          if (err) {
            callback('SERVER_ERROR');
            db.close();
          } else {
            callback(results);
            db.close();
          }
        });
      }
    });
  }
}

function submitMentorship (json, session, callback) {
  if (json.action !== 'submitMentorship') {
    callback('INCORRECT_ACTION_TYPE');
  } else if (typeof session.user === 'undefined' || session.user.role === 'student') {
    callback({'INVALID_FORM': 'Invalid Account Type'});
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@mentorships.js.submitMentorship().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        mentorships.createMentorshipObject(json, session, function (err, mentorship) {
          if (err) {
            console.log('mentorship creation error : fix this message');
            callback(err);
          } else {
            let collection = db.collection(globals.MENTORSHIP_TABLE);
            collection.insert([mentorship], function (err, done) {
              if (err) {
                console.log('err inserting mentorship: fix this message');
                callback('SERVER_ERROR');
              } else {
                callback('MENTORSHIP_CREATED');
              }
              db.close();
            });
          }
        });
      }
    });
  }
}

function subscribeToMentorship (json, user, callback) {
  if (json.action !== 'subscribeToMentorship') {
    callback('INCORRECT_ACTION_TYPE');
  } else if (typeof user === 'undefined') {
    callback('SESSION_UNDEFINED');
  }else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@mentorships.js.subscribeToMentorship().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      }
      let collection = db.collection(globals.MENTORSHIP_TABLE);
      collection.find({'_id': new ObjectId(json.mentorshipID)}).toArray(function (err, result) {
        if (err) {
          callback('SERVER_ERROR');
        } else if (result.length && result.length === 1) {
          let subscribedMentorship = result[0];
          let userID = new ObjectId(user._id);
          let subscribed = false;

          if (typeof subscribedMentorship.subscriberIDs !== 'undefined') {
            for (let i = 0; i < subscribedMentorship.subscriberIDs.length; i++) {
              if (subscribedMentorship.subscriberIDs[i].equals(userID)) subscribed = true;
            }
            if (!subscribed) subscribedMentorship.subscriberIDs.push(userID);
          } else {
            subscribedMentorship.subscriberIDs = [userID];
          }
          if (!subscribed) {
            collection.save(subscribedMentorship, function (err, done) {
              if (err) {
                console.log('err@mentorship.js:subscribeToMentorship() - ' + err);
                callback('SERVER_ERROR');
              } else {
                callback('SUBSCRIBED');
              }
            });
          } else {
            callback('ALREADY_SUBSCRIBED');
          }
        } else {
          callback('SERVER_ERROR');
        }
        db.close();
      });
    });
  }
}

function getSubscribedMentorships (json, user, callback) {
  if (json.action !== 'getSubscribedMentorships') {
    callback('INCORRECT_ACTION_TYPE');
  } else if (typeof user === 'undefined') {
    callback('SESSION_UNDEFINED');
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@mentorships.js.getSubscribedMentorships().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      }
      let collection = db.collection(globals.MENTORSHIP_TABLE);
      collection.find().toArray(function (err, result) {
        if (err) {
          callback('SERVER_ERROR');
        } else if (result.length) {
          let userID = new ObjectId(user._id);
          let subscribedMentorships = [];

          for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].subscriberIDs.length; j++) {
              if (result[i].subscriberIDs[j].equals(userID)) {
                subscribedMentorships.push(result[i]);
              }
            }
          }
          callback({'mentorships': subscribedMentorships});
        } else {
          callback('SERVER_ERROR');
        }
        db.close();
      });
    });
  }
}

module.exports = router;

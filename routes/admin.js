'use strict';

var express = require('express');
var router = express.Router();
let mongodb = require('mongodb');
let ObjectId = require('mongodb').ObjectID;
let Globals = require('../config');
let globals = new Globals();

router.post('/ToggleMentorship', function (req, res, next) {
  globals.verifyAdmin(req.session.user, function (valid) {
    if (valid) {
      let t0 = new Date().getTime();
      toggleMentorship(req.body, function (response) {
        let t1 = new Date().getTime();
        globals.prettyPrintResponse('ToggleMentorship', response, t1, t0);
        res.send(response);
      });
    } else {
      // Should never happen, the admin page shouldn't have loaded
      res.send('NOT_ADMIN_USER');
    }
  });
});

router.post('/ToggleUser', function (req, res, next) {
  globals.verifyAdmin(req.session.user, function (valid) {
    if (valid) {
      let t0 = new Date().getTime();
      toggleUser(req.body, function (response) {
        let t1 = new Date().getTime();
        globals.prettyPrintResponse('ToggleUser', response, t1, t0);
        res.send(response);
      });
    } else {
      // Should never happen, the admin page shouldn't have loaded
      res.send('NOT_ADMIN_USER');
    }
  });
});

router.post('/ToggleInternship', function (req, res, next) {
  globals.verifyAdmin(req.session.user, function (valid) {
    if (valid) {
      let t0 = new Date().getTime();
      toggleInternship(req.body, function (response) {
        let t1 = new Date().getTime();
        globals.prettyPrintResponse('ToggleInternship', response, t1, t0);
        res.send(response);
      });
    } else {
      // Should never happen, the admin page shouldn't have loaded
      res.send('NOT_ADMIN_USER');
    }
  });
});

router.post('/SiteRecommendation', function (req, res, next) {
  globals.verifyAdmin(req.session.user, function (valid) {
    if (valid) {
      let t0 = new Date().getTime();
      recommendations(req.body, function (response) {
        let t1 = new Date().getTime();
        globals.prettyPrintResponse('Recommendation', response, t1, t0);
        res.send(response);
      });
    } else {
      // Should never happen, the admin page shouldn't have loaded
      res.send('NOT_ADMIN_USER');
    }
  });
});



function toggleUser (json, callback) {
  if (json.action !== 'acceptOrDenyAccount') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log(err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection(globals.USER_TABLE);
        collection.find({'_id': new ObjectId(json.accountId)}).toArray(function (err, result) {
          if (err) {
            callback('SERVER_ERROR');
          } else if (result.length) {
            if (result.length === 1) {
              let user = result[0];
              let activate = json.accepted ? 1 : 0;
              user.active = activate;

              collection.save(user, function (err, done) {
                if (err) {
                  console.log('err@admin.js:toggleUser() - ' + err);
                  callback('SERVER_ERROR');
                } else {
                  if (activate)
                    callback('ACCOUNT_ACCEPTED');
                  else
                    callback('ACCOUNT_REJECTED');
                }
              });
            } else {
              callback('INVALID_POST');
            }
          } else {
            callback('INVALID_USER_ID');
          }
          db.close();
        });
      }
    });
  }
}

function toggleMentorship (json, callback) {
  if (json.action !== 'acceptOrDenyMentorship') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log(err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection(globals.MENTORSHIP_TABLE);
        collection.find({'_id': new ObjectId(json.mentorshipId)}).toArray(function (err, result) {
          if (err) {
            callback('SERVER_ERROR');
          } else if (result.length) {
            if (result.length === 1) {
              let mentorship = result[0];
              let activate = json.accepted ? 1 : 0;
              mentorship.active = activate;

              collection.save(mentorship, function (err, done) {
                if (err) {
                  console.log('err@admin.js:toggleMentorship() - ' + err);
                  callback('SERVER_ERROR');
                } else {
                  if (activate)
                    callback('MENTORSHIP_ACCEPTED');
                  else
                    callback('MENTORSHIP_REJECTED');
                }
              });
            }
          } else {
            callback('INVALID_MENTORSHIP_ID');
          }
          db.close();
        });
      }
    });
  }
}

function toggleInternship (json, callback) {
  if (json.action !== 'acceptOrDenyInternship') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log(err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection(globals.INTERNSHIP_TABLE);
        collection.find({'_id': new ObjectId(json.internshipId)}).toArray(function (err, result) {
          if (err) {
            callback('SERVER_ERROR');
          } else if (result.length) {
            if (result.length === 1) {
              let internship = result[0];
              let activate = json.accepted ? 1 : 0;
              internship.active = activate;

              collection.save(internship, function (err, done) {
                if (err) {
                  console.log('err@admin.js:toggleInternship() - ' + err);
                  callback('SERVER_ERROR');
                } else {
                  if (activate)
                    callback('INTERNSHIP_ACCEPTED');
                  else
                    callback('INTERNSHIP_REJECTED');
                }
              });
            }
          } else {
            callback('INVALID_INTERNSHIP_ID');
          }
          db.close();
        });
      }
    });
  }
}

function recommendations(json, callback) {
  if(json.action == "makeRecommendation"){
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log(err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('recommendations');
        let recommendation = json.recommendation;
        let priority = json.priority;
        try {
          collection.insertOne({'content':recommendation, 'priority':priority});
        } catch (e) {
          print(e);
        };
        callback('RECOMMENDATION_SAVED');
        }

      });
    } else if(json.action == "getRecommendations") {
      let MongoClient = mongodb.MongoClient;
      MongoClient.connect(globals.MONGO_URL, function (err, db) {
        if (err) {
          console.log(err);
          callback('SERVER_ERROR');
        } else {
          let collection = db.collection('recommendations');
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
  } else {
    callback("'INCORRECT_ACTION_TYPE'");
  }
}



module.exports = router;

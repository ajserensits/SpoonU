'use strict';

var express = require('express');
var router = express.Router();
let mongodb = require('mongodb');
let Globals = require('../config');
let globals = new Globals();
let nodemailer = require('nodemailer');
let Grid = require('gridfs-uploader');




/*
router.post('/GetAccounts', function (req, res, next) {
  globals.verifyAdmin(req.session.user, function (valid) {
    if (valid) {
      let t0 = new Date().getTime();
      getAccounts(req.body, function(response) {
        let t1 = new Date().getTime();
        res.send(response);
        console.log('POST@/GetAccounts --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
      });
    } else {
      res.send('NOT_ADMIN_USER');
      console.log('POST@/GetAccounts --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
    }
  });
});
*/

router.post('/GetAccounts', function (req, res, next) {
      let t0 = new Date().getTime();
      getAccounts(req.body, function(response) {
        let t1 = new Date().getTime();
        res.send(response);
        console.log('POST@/GetAccounts --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
      });
});

router.post('/GetUser', function (req, res, next) {
  let t0 = new Date().getTime();
  getUser(req.body, req.session.user, function (response) {
    let t1 = new Date().getTime();
    res.send(response);
    console.log('POST@/GetUser --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
  });
});


router.post('/GetInterests', function (req, res, next) {
  let t0 = new Date().getTime();
  getInterests(req.body, function (response) {
    let t1 = new Date().getTime();
    res.send(response);
    console.log('POST@/getInterests --- Response: '+ response + ' --- ' + (t1 - t0) + 'ms');
  });
});

router.post('/SaveUser', function (req, res, next) {
  let t0 = new Date().getTime();
  saveUser(req.body, req.session.user, function (response) {
    let t1 = new Date().getTime();
    res.send(response);
    console.log('POST@/saveUser --- Response: '+ response + ' --- ' + (t1 - t0) + 'ms');
  });
});

router.post('/SendAlerts', function (req, res, next) {
  let t0 = new Date().getTime();
  sendAlerts(req.body, req.session.user, function (response) {
    let t1 = new Date().getTime();
    res.send(response);
    console.log('POST@/sendAlerts --- Response: '+ response + ' --- ' + (t1 - t0) + 'ms');
  });
});

router.post('/GetRoles', function (req, res, next) {
  let t0 = new Date().getTime();
  getRoles(req.body, function (response) {
    let t1 = new Date().getTime();
    res.send(response);
    console.log('POST@/getRoles --- Response: '+ response + ' --- ' + (t1 - t0) + 'ms');
  });
});




function getAccounts(json, callback) {
  if(json.action !== 'getAccounts') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.getAccounts().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('users');
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

function getUser (json, user, callback) {
  if (json.action !== 'getUserAccount') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    callback(user);
  }
}

function getInterests (json, callback) {
  if(json.action !== 'getInterests') {
    callback('INCORRECT_ACTION_TYPE');
  } else {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.getInterests().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('interests');
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

function getRoles (json, callback) {
  if(json.action == 'getInternshipRoles') {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.getRoles().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('internshipRoles');
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
  } else if(json.action == 'getMentorshipRoles'){
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.getRoles().MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('mentorshipRoles');
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
      callback('INCORRECT_ACTION_TYPE');
  }

}

function saveUser(json, user, callback) {
  if(json.action == 'saveUserInterests') {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.saveUser()).MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('users');
        let email = json.email;
        let interests = json.interests;
        collection.update({'email':email},{$set:{'interests':interests}});
        user.interests = interests;
        callback('UPDATED USER');
      }
        });
  } else if(json.action == 'saveUserPreferences') {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.saveUser()).MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('users');
        let email = json.email;
        let QuestionAndAnswer = json.questionAndAnswer;
        collection.update({'email':email},{$set:{'questionAndAnswer':QuestionAndAnswer}});
        user.questionAndAnswer = QuestionAndAnswer;
        console.log("USER = ",user);
        callback('UPDATED USER');
      }
        });
  } else if(json.action == "saveUserInternshipRoles") {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.saveUser()).MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('users');
        let email = json.email;
        let internshipRoles = json.internshipRoles;
        collection.update({'email':email},{$set:{'internshipRoles':internshipRoles}});
        user.internshipRoles = internshipRoles;
        console.log("USER = ",user);
        callback('UPDATED USER');
      }
        });

  } else if(json.action == "saveUserMentorshipRoles") {
    let MongoClient = mongodb.MongoClient;
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.saveUser()).MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('users');
        let email = json.email;
        let mentorshipRoles = json.mentorshipRoles;
        collection.update({'email':email},{$set:{'mentorshipRoles':mentorshipRoles}});
        user.mentorshipRoles = mentorshipRoles;
        console.log("USER = ",user);
        callback('UPDATED USER');
      }
        });
  } else if(json.action == "saveAboutMe") {
    let MongoClient = mongodb.MongoClient;
    console.log("save ABOIT <E");
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.saveUser()).MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('users');
        let email = json.email;
        console.log("JSON == ", json.personalBio);
        let personalBio = json.personalBio;
        let company = json.company;
        let jobTitle = json.jobTitle;
        collection.update({'email':email},{$set:{'personalBio':personalBio,'company':company,'jobTitle':jobTitle}});

        user.personalBio = personalBio;
        user.company = company;
        user.jobTitle = jobTitle;
        console.log("USER = ",user);
        callback('UPDATED USER');
      }
        });

  } else callback('INCORRECT_ACTION_TYPE');
}

function sendAlerts(json, user, callback) {
  console.log("ABOUT TO SEND ALERTS");


  if(json.action == 'updatedQuestionAndAnswer') {
    let MongoClient = mongodb.MongoClient;
    let INTERESTS = json.interests;
    console.log("INTTTT = ", INTERESTS[0], INTERESTS[0].name);
    MongoClient.connect(globals.MONGO_URL, function (err, db) {
      if (err) {
        console.log('err@accounts.js.sendAlerts()).MongoClient.connect - ' + err);
        callback('SERVER_ERROR');
      } else {
        let collection = db.collection('users');
        let advisor = json.account;
        let interests = advisor.interests;
        if(interests.length != 0){
          collection.find().toArray(function (err, results) {
            if (err) {
              callback('SERVER_ERROR');
              db.close();
            } else {
              let userToBeAlerted, interestsInCommon, match;
              for(var i = 0;i < results.length; i++){ //Iterates through each user
                userToBeAlerted = results[i];
                interestsInCommon = new Array();
                match = false;
                if(results[i].interests && results[i].role == "student"){
                  for(var q = 0;q < results[i].interests.length; q++){ //Iterates through each user's interests
                    for(var k = 0;k < interests.length; k++){ //Iterates through each interest id
                      if(interests[k] == results[i].interests[q]){
                        for(var z = 0; z < INTERESTS.length; z++) {
                          if(INTERESTS[z].interest_id == interests[k]) {
                              interestsInCommon.push(INTERESTS[z].name);
                           }
                        }
                        match = true;
                      }
                    }
                  }

                }
                if(match == true) sendQuestionAndAnswerAlert(userToBeAlerted.email, advisor, interestsInCommon);


              }
              db.close();

            }
          });
        }

        callback('SENT ALERTS');
      }
        });
  } else callback('INCORRECT_ACTION_TYPE');
}

function pushIt(name, commonInterests) {
  commonInterests.push(name);
}

function sendQuestionAndAnswerAlert(recipient, advisor, commonInterests){
     console.log("ABOUT TO SEND ALERTS FOR Q/A", commonInterests);
      var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cardinalconnectalerts@gmail.com',
        pass: 'Mets71615215'
      }
    });

    var mailOptions = {
      from: 'cardinalconnectalerts@gmail.com',
      to: recipient,
      subject: 'Interest Match!',
      text: 'An advisor with similar interests to you has signed up for Cardinal Connect !\n' +
            'They are available for question and answer.\n' +
            'Advisor Name: ' + advisor.firstName + " " + advisor.lastName + "\n" +
            'Advisor Email: ' + advisor.email +"\n" +
            "Common Interests: "

    };


    for(var i = 0; i < commonInterests.length; i++){
      console.log("COMMON ",commonInterests[i]);
       mailOptions.text += commonInterests[i];
      if(i != commonInterests.length - 1) mailOptions.text += ", ";
    }

    console.log("MAIL: ", mailOptions.text);

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


}



module.exports = router;

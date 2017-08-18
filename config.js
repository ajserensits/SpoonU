
(function () {
  'use strict';

  let Globals = function () {
    this.MONGO_URL = 'mongodb://localhost:27017/cardinal-connect';
    this.USER_TABLE = 'users';
    this.INTERNSHIP_TABLE = 'internships';
    this.MENTORSHIP_TABLE = 'mentorships';
  };

  Globals.prototype.prettyPrintResponse = function (postLoc, response,  t1, t0) {
    console.log('POST@/' + postLoc + ' --- Response:' + response + ' --- ' + (t1 - t0) + 'ms');
  };

  Globals.prototype.verifyAdmin = function (user, callback) {
    if(!user) {
      callback(false);
    } else {
      if (user.role === 'admin') callback(true);
      else callback(false);
    }
  };

  module.exports = Globals;
})();

'use strict';

/*
 base dependencies
*/
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongo = require('mongodb');

/*
  application routes -- abstracted away to routes
*/

var index = require('./routes/index');
var admin = require('./routes/admin');
var accounts = require('./routes/accounts');
var internships = require('./routes/internships');
var mentorships = require('./routes/mentorships');

// the actual app that will be used
var app = express();

// allow serving of static files

app.use('/', express.static(path.join(__dirname, 'public')));

// for JSON POST parsing
app.use(bodyParser.json());

// sessions!
app.set('trust proxy', 1) // trust first proxy
app.use(session ({
  secret: 'they_will_never_know',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false
  },
}));

// map public routes to the '/'
/* TODO: eventually app.use('/Index', index) to access more specific /Index/Register */
app.use('/', index);
app.use('/', admin);
app.use('/', accounts);
app.use('/', internships);
app.use('/', mentorships);

module.exports = app;

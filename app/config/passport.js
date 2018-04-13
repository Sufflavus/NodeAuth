'use strict';

var Account = require('../models/account');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
	passport.serializeUser(Account.serializeUser());
	passport.deserializeUser(Account.deserializeUser());
	passport.use(new LocalStrategy(Account.authenticate()));
};

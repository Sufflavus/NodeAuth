'use strict';

var path = process.cwd();
var Account = require('../models/account');

module.exports = function (app, passport) {

    function isLoggedIn(req, res, next) {
        console.log("isLoggedIn")
        if (req.isAuthenticated && req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }

    app.route('/login')
        .get(function(req, res) {
            res.sendFile(path + '/public/login.html');
        })
        .post(function(req, res) {
            console.log('/login post')
            
            passport.authenticate('local')(req, res, function () {
                res.redirect('/profile');
            });
        });
        
    app.route('/register')
        .post(function(req, res, next) {
            console.log("/register")
            Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
                if (err) {
                    return next(err);
                }
        
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/profile');
                });
            });
        });
        
    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/login');
        });
        
    app.route('/index')
        .get(function(req, res) {
            res.sendFile(path + '/public/index.html');
        });
        
    app.route('/profile')
        .get(isLoggedIn, function(req, res) {
            console.log(req.user)
            res.sendFile(path + '/public/profile.html');
        });
        
    app.route('/api/:id')
        .get(isLoggedIn, function(req, res) {
            console.log(req.user)
            if (!req.isAuthenticated || !req.isAuthenticated()) {
              res.redirect('/login');
            } else {
              res.json(req.user);
            }
        });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }
    
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};

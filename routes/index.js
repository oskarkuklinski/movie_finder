const express = require('express');
const mid = require('../middleware');

const router = express.Router();
var User = require('../models/user');

router.get("/", (req, res, next) => {
    res.render('homepage', { title: "Home" } );
});

router.get("/about", (req, res, next) => {
    res.render('about', { title: "About" } );
});

router.get("/search", (req, res, next) => {
    res.render('search', { title: "Search" } );
});

router.get("/register", mid.loggedOut, (req, res, next) => {
    return res.render("register", { title: "Register" } ); 
});
router.post("/register", (req, res, next) => {
    if (req.body.email &&
    req.body.name &&
    req.body.favoriteMovie &&
    req.body.password &&
    req.body.confirmPassword) {
        if (req.body.password !== req.body.confirmPassword) {
            var err = new Error("Passwords don't match");
            err.status = 400;
            return next(err);
        }
        // Create new object from the filled form fields
        var userData = {
            email: req.body.email,
            name: req.body.name,
            favoriteMovie: req.body.favoriteMovie,
            password: req.body.password
        };
        // Use shema's 'create' method to insert document into Mongo
        User.create(userData, function(err, user) {
            if (err) {
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        var err = new Error("All field are required");
        err.status = 400;
        return next(err);
    }
});

router.get('/profile', mid.requiresLogin, (req, res, next) => {
    User.findById(req.session.userId)
        .exec(function(err, user) {
            if (err) {
                return next(err);
            } else {
                return res.render('profile', { title: "Profile", name: user.name, favoriteMovie: user.favoriteMovie } );
            }
        });
});

router.get('/login', mid.loggedOut, (req, res, next) => {
    return res.render('login', { title: "Log in" } );
});
router.post('/login', (req, res, next) => {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function(error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        const err = new Error('All fields are required');
        res.staus = 400;
        next(err);
    }
});

router.get('/logout', (req, res, next) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;
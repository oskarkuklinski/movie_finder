const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

// Connection to mlab database
mongoose.connect('mongodb://Oskar:awwshit@ds161793.mlab.com:61793/movie_finderdb'); // connect to our database

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('mongo connected!');
});

// Use sessions for tracking logins
app.use(session({
    secret: 'movie finder',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

// Make userId avaiable in templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    next();
});

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Path for static client files
app.use(express.static(__dirname + '/public'));

// Creating path for routes
const routes = require('./routes/index');
app.use('/', routes);

// Setting views folder
app.set('view engine', 'pug');
app.set('views', __dirname + "/views");

// Catch 404 error
app.use((req, res, next) => {
    const err = new Error('File not found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000, () => {
    console.log("Listening at localhost:3000");
})
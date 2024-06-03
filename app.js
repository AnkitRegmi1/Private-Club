require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('./middleware/passport');
const router = require('./routes/index');

const mongoURI = process.env.MONGO_URI;
const sessionSecret = process.env.SESSION_SECRET; // Retrieve session secret from .env

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

const app = express();
app.locals.moment = require('moment');

// Set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set up session store
const sessionStore = MongoStore.create({
  mongoUrl: mongoURI,
  collectionName: 'sessions',
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', router);

// Listen
app.listen(3000, () => console.log('App listening on port 3000'));

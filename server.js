require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const articlesRouter = require('./routes/articles');
const User = require('./model/User');
//databse connection

mongoose
	.connect('mongodb://localhost:27017/blogDB', {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Connected to Databse');
	})
	.catch(() => {
		console.log('Error connecting database');
	});

//PORT
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//app.use('/api/articles', articlesApiRouter);
app.use('/articles', articlesRouter);

app.get('/', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/articles');
	} else res.render('home');
});

app.get('/login', (req, res) => {
	res.render('login');
});
app.get('/register', (req, res) => {
	res.render('register');
});

app.get('/logout', (req, res) => {
	req.logOut();
	res.redirect('/');
});

app.post('/register', (req, res) => {
	User.register({ name: req.body.name, username: req.body.username }, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, function () {
				res.redirect('/login');
			});
		}
	});
});

app.post('/login', (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password
	});
	req.login(user, (err) => {
		if (err) {
			console.log(err);
			res.redirect('/login');
		} else {
			passport.authenticate('local')(req, res, () => {
				res.redirect('/articles');
			});
		}
	});
});
app.listen(PORT, () => {
	console.log(`Server started on PORT ${PORT}`);
});

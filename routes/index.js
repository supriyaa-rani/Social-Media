var express = require('express');
var router = express.Router();

const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('../models/userSchema')

passport.use(new localStrategy(User.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register-user',async function(req, res, next) {
  try {
    const {fullname, username, email, password} = req.body
    await User.register({fullname, username, email}, password)
    res.redirect('/login');
  } catch (error) {
    res.send(error)
  } 
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
});

module.exports = router;

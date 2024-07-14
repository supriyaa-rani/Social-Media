var express = require('express');
var router = express.Router();

const User = require('../models/userSchema')

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
    const newuser = new User(req.body)
    await newuser.save()
    res.redirect('/login');
  } catch (error) {
    res.send(error)
  } 
});

module.exports = router;

var express = require('express');
var router = express.Router();

const upload = require('../utils/multer').single('profilepic')
const fs = require('fs')
const path = require('path')

const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('../models/userSchema')

passport.use(new localStrategy(User.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user : req.user});
});

router.get('/login', function(req, res, next) {
  res.render('login', {user : req.user});
});

router.post('/login-user', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}),
function(req, res, next) {});

router.get('/about', function(req, res, next) {
  res.render('about', {user : req.user});
});

router.get('/register', function(req, res, next) {
  res.render('register', {user : req.user});
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

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile', {user : req.user});
});

router.get('/update-user/:id', isLoggedIn, function(req, res, next) {
  res.render('userupdate', {user : req.user});
});

router.get('/reset-password/:id', isLoggedIn, function(req, res, next) {
  res.render('userresetpassword', {user : req.user});
});

router.post('/reset-password/:id', isLoggedIn, async function(req, res, next) {
  try {
    await req.user.changePassword(
      req.body.oldpassword,
      req.body.newpassword,
    )
    req.user.save()
    res.redirect(`/update-user/${req.user._id}`);
  } catch (error) {
    res.send(error)
  }
});

router.get('/forget-email/', function(req, res, next) {
  res.render('userforgetemail', {user : req.user});
});

router.post('/forget-email/',async function(req, res, next) {
  try {
      const user = await User.findOne({email:req.body.email})

      if(user){
        res.redirect(`/forget-password/${user._id}`)
      }else{
        res.redirect('/forget-email')
      }
  } catch (error) {
    res.send(error)
  }
});

router.get('/forget-password/:id', function(req, res, next) {
  res.render('userforgetpassword', {user : req.user, id: req.params.id});
});

router.post('/forget-password/:id',async function(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
    await user.setPassword(req.body.password)
    await user.save()
    res.redirect('/login')
  } catch (error) {
    res.send(error)
  }
});

router.post('/image/:id',isLoggedIn, upload, async function(req, res, next){
  try {
    if (req.user.profilepic !== "default.png") {
      fs.unlinkSync(
        path.join(__dirname, '..', 'public', 'images', req.user.profilepic)
      )
    } 
      req.user.profilepic = req.file.filename
      await req.user.save()
      res.redirect(`/update-user/${req.params.id}`)
  } catch (error) {
    res.send(error)
  }
})

router.get('/logout-user', isLoggedIn, function(req, res, next) {
  req.logout(()=>{
    res.redirect('/login');
  })
  
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated){
    next()
  }else{
    res.redirect("/login")
  }
}

module.exports = router;

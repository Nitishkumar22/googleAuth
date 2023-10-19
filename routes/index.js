var express = require('express');
var router = express.Router();
var userModel = require('./users.js')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');

 require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Google sign in :-

router.get('/login', function (req, res, next) {
  res.render('login');
});


router.get('/login/federated/google', passport.authenticate('google'));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID'],
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
      callbackURL: '/oauth2/redirect/google',
      scope: ['profile', 'email'],
    },
    async function verify(issuer, profile, cb) {
      // console.log(profile)
      try {
        console.log(profile);
        let user = await userModel.findOne({ email: profile.emails[0].value });
        if (user) {
          return cb(null,user);
        }
        let newUser = await userModel.create({
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        cb(null,newUser);
        // newUser.save()
      } catch (err) {
        console.log('Anurag : ' + err);
        cb(err);
      }
    }
  )
);



router.get('/oauth2/redirect/google',passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

module.exports = router;

var express = require('express');
var router = express.Router();
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var axios = require('axios');

const GITHUB_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
const hat = require('hat');
const User = require('../schema/User');
const ObjectUtils = require('../utils/ObjectUtils');

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://35.202.71.143:3000/auth/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
  }
));

router.get('/verify_auth', function(req, res){
    const {userToken} = req.query;
    User.findOne({"userToken": userToken}).then(function(userResponse){
        
    });
});

router.post('/verify', function(req, res){
  const {userToken} = req.body;    

  if (ObjectUtils.isEmptyString(userToken)) {
     res.status(400).send({"message": "failure", "currentUser": {}});
  } else {
    User.findOne({"user_web_token": userToken}).then(function(userDataResponse){
        res.send({"message": "success", "currentUser": userDataResponse});  
    }).catch(function(err){
        res.status(400).send({"message": "failure", "currentUser": {}});
    });
  }
});

router.get('/callback', function(req, res){
    
    res.send({"message": "success"});
});


router.post('/authorize', function(req, res){
   const {code} = req.body;
   //console.log(code);
   const req_body = {"code": code, "client_id": GITHUB_CLIENT_ID, "client_secret": GITHUB_CLIENT_SECRET};
   const req_header = {"Accept": "application/json"}    
   
   axios.post('https://github.com/login/oauth/access_token', req_body, {"headers": req_header}).then(function(authResponse){
       const {access_token} = authResponse.data;
       axios.get(`https://api.github.com/user?access_token=${access_token}`).then(function(userData){
           const {name, company, email, bio, avatar_url} = userData.data;
           const user_web_token = hat();
           const userPayload = {access_token, name, company, email, bio, avatar_url, user_web_token};
           var user = new User(userPayload);
           user.save({}).then(function(userCreateResponse){
              res.send({"message": "success", "currentUser": userCreateResponse}); 
           });
       })
   }).catch(function(err){
       console.log(err);
          res.status(500).send({"message": "failure"});
   });
   

});


module.exports = router;
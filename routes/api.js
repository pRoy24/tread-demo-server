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

router.post('/pin', function(req, res){
    const {userToken} = req.headers;
    console.log(req.body);
    res.send({"message": "success"});
});

router.get('/user_detail', function(req, res){
    
});




module.exports = router;
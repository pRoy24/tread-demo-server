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
    const {usertoken} = req.headers;

    let {link, tags, added} = req.body;
    if (!tags) {
        tags = ["default"];
        added = new Date();
    }
    const imageData = {link, tags, added};

    
    User.findOne({"user_web_token": usertoken}).then(function(userData){
        if (ObjectUtils.isNonEmptyArray(userData.user_image_pins)) {
            userData.user_image_pins.push(imageData);
        } else {
            userData.user_image_pins = [imageData];
        }
        userData.save({}).then(function(saveResponse){
            console.log(saveResponse);
            res.send({"message": "success"});
        })
    })
});

router.get('/wall', function(req, res){
    const {usertoken} = req.headers;
    let {page} = req.query;
    if (!page) {
        page = 1;
    }
    let skipValue = (page - 1) * 10;
    User.findOne({"user_web_token": usertoken}, 'user_image_pins', { skip: skipValue, limit: 10 }).then(function(userImagePins){
        console.log(userImagePins);
       res.send({"message": "success", "data": userImagePins});
    });
});


router.get('/user_detail', function(req, res){
    
});




module.exports = router;
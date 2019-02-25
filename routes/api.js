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
var fs = require('fs');
const extractor = require('unfluff');


router.post('/pin', function(req, res){
    const {usertoken} = req.headers;

    let {link, tags, added} = req.body;
    let imageLink = "https://via.placeholder.com/150";
    
    var isLinkImage = endsWithAny(["jpg", "png", "gif", "jpeg"], link);
    if (!tags) {
        tags = ["default"];
        added = new Date();
    }
    
    if (isLinkImage) {
        imageLink = link;
        const imageData = {link, tags, added, imageLink};        
        saveUser(usertoken, imageData).then(function(saveRes){
            res.send({"message": "success", "user": saveRes});
        });        
    } else {
        // If webpage extract first image from webpage.
        axios.get(link).then(function(htmlFile){
            let pageData = extractor(htmlFile.data);
            const pageImage = pageData.image;
            if (pageImage) {
                imageLink = pageImage;
            }    
            const imageData = {link, tags, added, imageLink};
            saveUser(usertoken, imageData).then(function(saveRes){
                res.send({"message": "success", "user": saveRes});
            });
        })
    }

});

router.get('/wall', function(req, res){
    const {usertoken} = req.headers;
    let {page} = req.query;
    if (!page) {
        page = 1;
    }
     page = Number(page);
     let multiplier = (page - 1) * 12;
    const pageStartIndex = page === 1 ? multiplier : multiplier + 1;
    const pageEndIndex = pageStartIndex + 12;
    
    let next = page + 1;
    console.log("Start "+ pageStartIndex + " End "+ pageEndIndex);
    User.findOne({"user_web_token": usertoken}, 'user_image_pins').then(function(userImagePins){
        let userPins = userImagePins.user_image_pins; 
        let pinLength = userPins.length;

        if (pinLength > pageEndIndex) {
            userPins = userPins.slice(pageStartIndex, pageEndIndex);
        } else {
          userPins = userPins.slice(pageStartIndex, pinLength);
           next = -1; 
        }
       res.send({"message": "success", "data": userPins, "next": next});
    });
});


router.get('/user_detail', function(req, res){
    
});

router.get('/profiles', function(req, res){
    User.find({}, 'name email avatar_url userName').then(function(userDataResponse){
        console.log(userDataResponse);
        res.send({"message": "success", "data": userDataResponse});
    });
});

router.get('/profile_wall', function(req, res){

    let {page, username} = req.query;
    if (!page) {
        page = 1;
    }
     page = Number(page);
     let multiplier = (page - 1) * 12;
    const pageStartIndex = page === 1 ? multiplier : multiplier + 1;
    const pageEndIndex = pageStartIndex + 12;
    
    let next = page + 1;
    console.log("Start "+ pageStartIndex + " End "+ pageEndIndex);
    console.log("Username "+username);
    
    User.findOne({"userName": username}, 'user_image_pins').then(function(userImagePins){
        
        let userPins = userImagePins.user_image_pins; 
        let pinLength = userPins.length;

        if (pinLength > pageEndIndex) {
            userPins = userPins.slice(pageStartIndex, pageEndIndex);
        } else {
          userPins = userPins.slice(pageStartIndex, pinLength);
           next = -1; 
        }
       res.send({"message": "success", "data": userPins, "next": next});
    });    
})


function endsWithAny(suffixes, string) {
    return suffixes.some(function (suffix) {
        return string.endsWith(suffix);
    });
}

function saveUser(usertoken, imageData) {
    return User.findOne({"user_web_token": usertoken}).then(function(userData){
        if (ObjectUtils.isNonEmptyArray(userData.user_image_pins)) {
            userData.user_image_pins.push(imageData);
        } else {
            userData.user_image_pins = [imageData];
        }
        return userData.save({}).then(function(saveResponse){
            return saveResponse;
        })
    })
}
module.exports = router;
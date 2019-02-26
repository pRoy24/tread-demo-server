
var mongoose = require('mongoose');

var db = mongoose.connection;


var Schema = mongoose.Schema;

var UrlSschema = new Schema({
    link: String,
    linkHash: String
  });
  
  
var Url = mongoose.model('Url', UrlSschema);
 
module.exports = Url;
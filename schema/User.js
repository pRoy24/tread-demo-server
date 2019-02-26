const DB_SERVER_IP = process.env.DB_SERVER_IP;

var mongoose = require('mongoose');

mongoose.connect(`mongodb://${DB_SERVER_IP}/tread-db`);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected");
});

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    userName: String,
    company: String,
    email: String,
    bio: String,
    avatar_url: String,
    access_token: String,
    user_web_token: String,
    user_image_pins: [{link: String, added: { type: Date, default: Date.now}, tags: [String], imageLink: String, urlHash: String}]
  });
  
  
var User = mongoose.model('User', UserSchema);
 
module.exports = User;
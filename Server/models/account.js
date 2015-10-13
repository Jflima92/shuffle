var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Account = new Schema({
  name: String,
  password: String,
  photo: {
    type: String,
    default: "img/default_profile_photo.png"
  },

  music_genres: [Genre],
});


module.exports = mongoose.model('Account', Account);
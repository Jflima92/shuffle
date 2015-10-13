var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Account = new Schema({
  name: String,
  photo: {
    type: String,
    default: "img/default_profile_photo.png"
  },

});


module.exports = mongoose.model('Account', Account);
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  collegeId: {type:Number, required: true, match: /^\d{10}$/},
  password: {type:String, required: true, match : /^(?=.*\d).{8,}$/}
});

module.exports = mongoose.model('User', userSchema);

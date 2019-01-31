const mongoose = require('mongoose');

const ideaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  collegeId: {type:Number, required: true, match: /^\d{10}$/},
  author: {type: String, required:true},
  name: {type: String, required: true},
  abstract: {type: String, required:true},
  document: {type: String},
  contact: {type: Number, required:true, match: '/^\d{10}$/'},
  date: { type: Date, default: Date.now },
  likes: {type: Number, default: 0}
});

module.exports = mongoose.model('Idea', ideaSchema);

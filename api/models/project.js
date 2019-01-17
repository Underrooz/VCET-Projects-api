const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  collegeId: {type: mongoose.Schema.Types.ObjectId, ref:"user"},
  projectName: {type:String, required: true},
  teamMembers: {type:String, required: true},
  dept: {type:String, required: true},
  abstract: {type:String, required: true},
  projectImage:{type: String},
  document: {type: String},
  contact: {type:Number, required: true, match: '/^\d{10}$/'},
  date: {type: Date, default: Date.now},
  likes: {type: Number, default: 0}
});

module.exports = mongoose.model('Project', projectSchema);

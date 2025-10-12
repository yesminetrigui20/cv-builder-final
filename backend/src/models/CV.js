const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Mon CV'
  },
  personalInfo: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  profile: {
    type: String,
    default: ''
  },
  education: [{
    degree: String,
    school: String,
    city: String,
    startMonth: String,
    startYear: String,
    endMonth: String,
    endYear: String,
    description: String
  }],
  experience: [{
    jobTitle: String,
    employer: String,
    city: String,
    startMonth: String,
    startYear: String,
    endMonth: String,
    endYear: String,
    description: String,
    isCurrent: Boolean
  }],
  skills: [{
    name: String,
    level: String
  }],
  languages: [{
    language: String,
    level: String
  }],
  additionalSections: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CV', cvSchema);
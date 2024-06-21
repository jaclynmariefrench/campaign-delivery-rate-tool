const mongoose = require('mongoose');

const RatingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Delivery Rate', 'Open Rate', 'Click Rate', 'Unsubscribe Rate', 'Complaint Rate']
  },
  range: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
});

module.exports = mongoose.model('RatingRule', RatingRuleSchema);
import mongoose from 'mongoose';

const RatingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Delivery Rate', 'Open Rate', 'Click Rate', 'Unsubscribe Rate', 'Complaint Rate']
  },
  condition: {
    type: String,
    required: true,
    enum: ['Between', '<', '<=', '>', '>=', '===']
  },
  minValue: {
    type: Number,
    required: true
  },
  maxValue: {
    type: Number,
    required: false
  },
  score: {
    type: Number,
    required: true
  },
});

export default mongoose.model('RatingRule', RatingRuleSchema);
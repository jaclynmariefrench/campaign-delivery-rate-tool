import mongoose from 'mongoose';

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

export default mongoose.model('RatingRule', RatingRuleSchema);
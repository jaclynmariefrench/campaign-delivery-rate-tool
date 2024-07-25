import RatingRule from "./models/ratingSchema.js";
import DeliverabilityRating from "./models/deliverabilityRatingSchema.js";


function evaluateCondition(rate, condition, minValue, maxValue) {
  switch (condition) {
    case ">=":
      return rate >= minValue;
    case "Between":
      return rate >= minValue && rate <= maxValue;
    case ">":
      return rate > minValue;
    case "<":
      return rate < minValue;
    case "<=":
      return rate <= minValue;
    default:
      return false;
  }
}

export async function calculateDeliverabilityRating(
  deliveryRate,
  openRate,
  clickRate,
  unsubscribeRate,
  complaintRate
) {
  let score = 0;

  // Fetch the rules from the database
  const rules = await RatingRule.find();

  // Deliverability rating table rules
  const ratingRules = await DeliverabilityRating.find();

  // Validate and parse the rates
  const rates = {
    "Delivery Rate": parseFloat(deliveryRate),
    "Open Rate": parseFloat(openRate),
    "Click Rate": parseFloat(clickRate),
    "Unsubscribe Rate": parseFloat(unsubscribeRate),
    "Complaint Rate": parseFloat(complaintRate),
  };


  // Calculate the score based on the rules
  rules.forEach(rule => {
    const rate = rates[rule.name];
    if (evaluateCondition(rate, rule.condition, rule.minValue, rule.maxValue)) {
      score += rule.score;
    }
  });


  // Determine the deliverability rating based on the score
  let deliverabilityRating = "Undefined";
  let progressBar = 0;
  ratingRules.forEach(ratingRule => {
    if (evaluateCondition(score, ratingRule.condition, ratingRule.minScore, ratingRule.maxScore)) {
      deliverabilityRating = ratingRule.ratingTerm;
      progressBar = ratingRule.progressBar;
    }
  });


  // Return the calculated score and deliverability rating
  return {
    score,
    deliverabilityRating,
    progressBar
  };
}
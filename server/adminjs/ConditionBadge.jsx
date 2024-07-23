import React from "react";
import { Badge } from "@adminjs/design-system";

// Function to convert condition to HTML entity
const conditionToEntity = (condition) => {
    switch (condition) {
        case "<":
            return "&lt;";
        case ">":
            return "&gt;";
        case "<=":
            return "&le;";
        case ">=":
            return "&ge;";
        case "===":
            return "==="; // No need for conversion
        default:
            return condition; // For 'Between' or any other condition
    }
};

// Component to display the badge with the correct entity
const ConditionBadge = ({ record }) => {
    const condition = record.params.condition;
    const entity = conditionToEntity(condition); 
    return (
        <Badge dangerouslySetInnerHTML={{ __html: entity }} />
    );
};

export default ConditionBadge;


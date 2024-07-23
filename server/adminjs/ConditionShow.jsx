import React from "react";
import { Section, ValueGroup } from "@adminjs/design-system";
import { useTranslation } from "adminjs";
import ConditionBadge from "./ConditionBadge";

const ConditionShow = (props) => {
  const { property, record } = props;
  const { translateProperty } = useTranslation();

  return (
    <ValueGroup label={translateProperty(property.label, property.resourceId)}>
      <Section style={{ border: "none" }}>
        <ConditionBadge record={record} />
      </Section>
    </ValueGroup>
  );
};

export default ConditionShow;

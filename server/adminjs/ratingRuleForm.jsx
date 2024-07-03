import React, { useState } from "react";
import { Box, Label, Input, Button, Select } from "@adminjs/design-system";

// just some regular React component
const RatingRuleForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    condition: "",
    minValue: "",
    maxValue: "",
    score: "",
  });

  const [showMaxValue, setShowMaxValue] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input Change - Name: ${name}, Value: ${value}`);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "condition") {
      setShowMaxValue(value === "Between");
    }
  };

  const handleSelectChange = (name) => (selectedOption) => {
    const value = selectedOption.value;
    console.log(`Select Change - Name: ${name}, Value: ${value}`);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "condition") {
      setShowMaxValue(value === "Between");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const getOptions = (name) => {
    const options = {
      name: [
        { value: "Delivery Rate", label: "Delivery Rate" },
        { value: "Open Rate", label: "Open Rate" },
        { value: "Click Rate", label: "Click Rate" },
        { value: "Unsubscribe Rate", label: "Unsubscribe Rate" },
        { value: "Complaint Rate", label: "Complaint Rate" },
      ],
      condition: [
        { value: "Between", label: "Between" },
        { value: "<", label: "<" },
        { value: "<=", label: "<=" },
        { value: ">", label: ">" },
        { value: ">=", label: ">=" },
        { value: "===", label: "===" },
      ],
    };

    return options[name] || [];
  };

  const getOption = (name, value) => {
    return getOptions(name).find((option) => option.value === value) || null;
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Label htmlFor="name">Name</Label>
      <Select
        id="name"
        name="name"
        value={getOption("name", formData.name)}
        onChange={handleSelectChange("name")}
        options={getOptions("name")}
      />
      <Label htmlFor="condition">Condition</Label>
      <Select
        id="condition"
        name="condition"
        value={getOption("condition", formData.condition)}
        onChange={handleSelectChange("condition")}
        options={getOptions("condition")}
      />

      <Label htmlFor="minValue">Min Value</Label>
      <Input
        id="minValue"
        name="minValue"
        value={formData.minValue}
        onChange={handleInputChange}
      />
      {showMaxValue && (
        <>
          <Label htmlFor="maxValue">Max Value</Label>
          <Input
            id="maxValue"
            name="maxValue"
            value={formData.maxValue}
            onChange={handleInputChange}
          />
        </>
      )}

      <Label htmlFor="score">Score</Label>
      <Input
        id="score"
        name="score"
        value={formData.score}
        onChange={handleInputChange}
      />
      <Button type="submit">Submit</Button>
    </Box>
  );
};

export default RatingRuleForm;

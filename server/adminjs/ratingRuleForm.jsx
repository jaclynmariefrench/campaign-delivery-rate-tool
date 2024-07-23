import React, { useState } from "react";
import {
  Box,
  Label,
  Input,
  Button,
  Select,
  Section,
} from "@adminjs/design-system";
import { useNotice } from "adminjs";

function RatingRuleForm() {
  const [formData, setFormData] = useState({
    name: "",
    condition: "",
    minValue: "",
    maxValue: "",
    score: "",
  });

  const [showMaxValue, setShowMaxValue] = useState(false);
  const addNotice = useNotice();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "condition") {
      setShowMaxValue(value === "Between");
    }
  };

  const handleSelectChange = (name) => (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
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

    const formDataObj = new FormData();
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    fetch("/admin/api/resources/RatingRule/actions/new", {
      method: "POST",
      body: formDataObj,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        addNotice({
          message: 'RatingRule submitted successfully!',
          type: 'success',
        });
        // Redirect after a short delay to ensure the message is shown
        setTimeout(() => {
          window.location.assign("/admin/resources/RatingRule");
        }, 2000); // Adjust the delay time as needed
      })
      .catch((error) => {
        console.error("Error:", error);
        addNotice({
          message: `Error submitting RatingRule: ${error.message}`,
          type: 'error',
        });
      });
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

  const inputContainer = {
    marginBottom: "2.5rem",
  };

  const buttonContainer = {
    display: "flex",
    justifyContent: "space-around",
    padding: "0px 32px 32px",
    border: "none",
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Box variant="white">
        <Box style={inputContainer}>
          <Label htmlFor="name">Name</Label>
          <Select
            id="name"
            name="name"
            value={getOption("name", formData.name)}
            onChange={handleSelectChange("name")}
            options={getOptions("name")}
            isClearable
          />
        </Box>
        <Box style={inputContainer}>
          <Label htmlFor="condition">Condition</Label>
          <Select
            id="condition"
            name="condition"
            value={getOption("condition", formData.condition)}
            onChange={handleSelectChange("condition")}
            options={getOptions("condition")}
            isClearable
          />
        </Box>
        <Box style={inputContainer}>
          <Label htmlFor="minValue">
            {showMaxValue ? "Min Value" : "Value"}
          </Label>
          <Input
            id="minValue"
            name="minValue"
            value={formData.minValue}
            onChange={handleInputChange}
            width={1}
          />
          {showMaxValue && (
            <>
              <Label htmlFor="maxValue">Max Value</Label>
              <Input
                id="maxValue"
                name="maxValue"
                value={formData.maxValue}
                onChange={handleInputChange}
                width={1}
              />
            </>
          )}
        </Box>
        <Box style={inputContainer}>
          <Label htmlFor="score">Score</Label>
          <Input
            id="score"
            name="score"
            value={formData.score}
            onChange={handleInputChange}
            width={1}
          />
        </Box>
        <Section style={buttonContainer}>
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Section>
      </Box>
    </Box>
  );
}

export default RatingRuleForm;

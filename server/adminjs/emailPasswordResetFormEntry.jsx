import React from "react";
import { createRoot } from "react-dom/client";
import EmailPasswordResetForm from "./emailPasswordResetForm.jsx"; // Ensure the correct file name

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<EmailPasswordResetForm />);
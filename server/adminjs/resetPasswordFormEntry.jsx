import React from "react";
import { createRoot } from "react-dom/client";
import ResetPasswordForm from "./resetPasswordForm.jsx"; // Ensure the correct extension

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<ResetPasswordForm />);

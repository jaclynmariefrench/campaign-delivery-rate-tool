import React, { useState } from "react";

const EmailPasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // Add state for message type

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/admin/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.status === 429) {
        setMessage(data.message);
        setMessageType("error"); // Set message type to error
      } else if (data.success) {
        setMessage("Password reset link has been sent to your email.");
        setMessageType("success"); // Set message type to success
      } else {
        setMessage(data.message || "Email not found.");
        setMessageType("error"); // Set message type to error
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      setMessageType("error"); // Set message type to error
    }
  };

  // Styles
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
    },
    formWrapper: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
    },
    message: {
      color: messageType === "success" ? 'blue' : 'red', // Conditionally apply color
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2>Forgot Password</h2>
        <p>Enter your email to reset your password.</p>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailPasswordResetForm;

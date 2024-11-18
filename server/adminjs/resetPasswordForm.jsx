import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

// Styled components
const Box = styled.div`
  background-color: #fff;
  width: 400px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Label = styled.label`
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  display: block;
`;

const H2 = styled.h2`
  font-size: 24px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Text = styled.p`
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 20px;
`;

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      const response = await fetch(`http://localhost:3000/reset/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.text();
      setMessage(data);
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <Box>
      <H2>Reset Password</H2>
      <form onSubmit={handleSubmit}>
        <div>
          <Label>New Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Reset Password</Button>
      </form>
      {message && <Text>{message}</Text>}
    </Box>
  );
};

export default ResetPasswordForm;





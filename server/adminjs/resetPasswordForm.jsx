import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  height: 100vh;
`;

const Box = styled.div`
  background-color: #fff;
  width: 400px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  grid-row: 2;
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
`;

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const tokenParam = pathParts[pathParts.length - 1]; // Get the last part of the path
    setToken(tokenParam);
    console.log("Token from URL:", tokenParam);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("Token is missing or invalid.");
      return;
    }
    try {
      console.log("Submitting password reset request with token:", token);
      const response = await fetch(`/reset/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
  
      const data = await response.text();
      console.log("Response from server:", data);
      setMessage(data);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Error resetting password");
    }
  };

  return (
    <Container>
      <Box>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <Label>New Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Reset Password</Button>
        </form>
        {message && <p>{message}</p>}
      </Box>
    </Container>
  );
};

export default ResetPasswordForm;

// import React, { useState } from 'react';
// import styled from 'styled-components';
// import { useParams } from 'react-router-dom';

// // Styled components
// const Container = styled.div`
//   display: grid;
//   grid-template-rows: repeat(3, 1fr);
//   height: 100vh;
// `;

// const Box = styled.div`
//   background-color: #fff;
//   width: 400px;
//   margin: 0 auto;
//   padding: 40px;
//   border-radius: 8px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//   grid-row: 2;
// `;

// const Button = styled.button`
//   background-color: #007bff;
//   color: white;
//   padding: 12px;
//   border: none;
//   border-radius: 8px;
//   width: 100%;
//   cursor: pointer;
//   font-size: 16px;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 12px;
//   margin: 10px 0;
//   border-radius: 8px;
//   border: 1px solid #ccc;
//   font-size: 16px;

//   &:focus {
//     border-color: #007bff;
//     outline: none;
//   }
// `;

// const Label = styled.label`
//   font-size: 16px;
//   color: #333;
// `;

// const ResetPasswordForm = () => {
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const { token } = useParams();
  
//   console.log("Token from URL", token);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`/reset/${token}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ password }),
//       });

//       const data = await response.text();
//       setMessage(data);
//     } catch (error) {
//       setMessage("Error resetting password");
//     }
//   };

//   return (
//     <Container>
//       <Box>
//         <h2>Reset Password</h2>
//         <form onSubmit={handleSubmit}>
//           <Label>New Password:</Label>
//           <Input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <Button type="submit">Reset Password</Button>
//         </form>
//         {message && <p>{message}</p>}
//       </Box>
//     </Container>
//   );
// };

// export default ResetPasswordForm;





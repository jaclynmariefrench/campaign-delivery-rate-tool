import React from "react";
import { Box, Button, H2, Text, Illustration, FormGroup, Input, Label } from "@adminjs/design-system";

const CustomLogin = (props) => {
  const { action, message } = props;

  return (
    <Box variant="grey">
      <Box variant="white" boxShadow="card" width={[1, 2 / 3, 1 / 3]} mx="auto" my="xl">
        <Box p="lg">
          <Illustration variant="Rocket" />
          <H2>Welcome to Travis Admin</H2>
          <Text>Log in to your account</Text>
          {message && <Text variant="danger">{message}</Text>}
          <form action={action} method="POST">
            <FormGroup>
              <Label>Email</Label>
              <Input name="email" type="email" required />
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input name="password" type="password" required />
            </FormGroup>
            <Button variant="primary" type="submit" mt="lg" width={1}>
              Log in
            </Button>
          </form>
          <Text mt="lg">
            Need help? <a href="/admin/reset-password">Forgot Password?</a>
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomLogin;
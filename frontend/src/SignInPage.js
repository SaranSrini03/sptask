import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { GoogleLoginButton, FacebookLoginButton } from 'react-social-login-buttons';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background: linear-gradient(135deg, #6b34ff, #9b34ff);
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
    color: white;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.h1`
  margin-bottom: 0;
`;

const SubHeader = styled.p`
  margin-top: 0;
  margin-bottom: 2em;
  font-size: 1.2em;
`;

const FormContainer = styled.div`
  background: #1f1f1f;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  text-align: left;
  margin-bottom: 0.5em;
  color: white;
`;

const Input = styled.input`
  padding: 1em;
  margin-bottom: 1em;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  background: #333;
  color: white;
`;

const Button = styled.button`
  padding: 1em;
  background: #6b34ff;
  border: none;
  border-radius: 5px;
  font-size: 1.2em;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1em;
  color: white;

  &:hover {
    background: #9b34ff;
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const SignInPage = () => {
  return (
    <>
      <GlobalStyle />
      <Container>
        <Header>Stillprofit</Header>
        <SubHeader>Welcome to the era of laziness 4.0 🤖</SubHeader>
        <FormContainer>
          <Form>
            <Label>Username</Label>
            <Input type="text" placeholder="X_AE_A_13b" />
            <Label>Email Address</Label>
            <Input type="email" placeholder="elementary221b@gmail.com" />
            <Label>Password</Label>
            <Input type="password" placeholder="**********" />
            <Button type="submit">Sign Up</Button>
          </Form>
          <SocialLoginContainer>
            <GoogleLoginButton onClick={() => alert('Google Login')} />
            <FacebookLoginButton onClick={() => alert('Facebook Login')} />
          </SocialLoginContainer>
        </FormContainer>
      </Container>
    </>
  );
};

export default SignInPage;

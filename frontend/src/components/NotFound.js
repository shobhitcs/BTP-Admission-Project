import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import image404 from '../images/error.jpg';

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const StyledContainer = styled(Container)`
  margin-top: 2rem;
  text-align: center;
`;

const StyledImage = styled('img')`
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
  animation: ${bounce} 2s infinite;
`;

const NotFound = () => {
  return (
    <StyledContainer maxWidth="sm">
      <StyledImage src={image404} alt="404 Not Found" />
      <Typography variant="h4" gutterBottom>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/"
        style={{ marginTop: '1rem' }}
      >
        Go to Home Page
      </Button>
    </StyledContainer>
  );
};

export default NotFound;

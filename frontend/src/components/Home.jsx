import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardActions, useTheme, useMediaQuery, Grid } from "@mui/material";
import StartSharpIcon from "@mui/icons-material/StartSharp";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import WifiProtectedSetupSharpIcon from "@mui/icons-material/WifiProtectedSetupSharp";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

function Home(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      const jwtToken = getCookie("jwtToken");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/check-authentication/`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("the response is: ", response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("User is not authenticated. Navigating to '/'...");
          navigate("/");
        } else {
          console.error("Error checking authentication:", error);
        }
      }
    };
    checkAuthentication();
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px', // Adjusted to match spacing from Box
        padding: '80px',
        // paddingTop: '80px',
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/initialise" style={{ textDecoration: 'none' }}>
            <Card sx={{ 
              height: '100%', 
              padding: '20px',
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: 3, 
              transition: 'transform 0.3s', 
              '&:hover': { 
                transform: 'scale(1.03)', 
                boxShadow: 6 
              } 
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <StartSharpIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  Initialisation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Initialise the database to generate offers
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/seatmatrix" style={{ textDecoration: 'none' }}>
            <Card sx={{ 
              height: '100%', 
              padding: '20px',
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: 3, 
              transition: 'transform 0.3s', 
              '&:hover': { 
                transform: 'scale(1.03)', 
                boxShadow: 6 
              } 
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <ChairAltIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  Seat Matrix
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Number of seats in each category
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/rounds" style={{ textDecoration: 'none' }}>
            <Card sx={{ 
              height: '100%', 
              padding: '20px',
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: 3, 
              transition: 'transform 0.3s', 
              '&:hover': { 
                transform: 'scale(1.03)', 
                boxShadow: 6 
              } 
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <WifiProtectedSetupSharpIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  Rounds
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You can find your round details here
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Link to="/search" style={{ textDecoration: 'none' }}>
            <Card sx={{ 
              height: '100%', 
              padding: '20px',
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: 3, 
              transition: 'transform 0.3s', 
              '&:hover': { 
                transform: 'scale(1.03)', 
                boxShadow: 6 
              } 
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <SearchIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
                <Typography variant="h6" color="text.primary" sx={{ fontWeight: 'bold' }}>
                  Search
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You can find and update candidate statuses
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default Home;

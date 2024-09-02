import React, { useState } from "react";
import { Button, Snackbar, Alert, Typography, Box, Container } from "@mui/material";
import FileUploader from "./FileUploader";
import MatchColumns from "./MatchColumns";
import axios from "axios";

function Initialise(props) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Function to call server to reset database
  const handleReset = async () => {
    try {
      const jwtToken = getCookie("jwtToken"); // Get JWT token from cookie

      // Proceed with resetting database
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/initialise/reset`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      window.location.reload();
    } catch (error) {
      console.log("Error:", error);
      setAlertMessage(error.response?.data?.result || "An error occurred");
      setAlertSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
        padding={4}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          width="100%"
        >
          <Typography variant="h4" color="textSecondary">
            Initialise The DataBase
          </Typography>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ color: "white", backgroundColor: "red", '&:hover': { backgroundColor: "darkred" } }}
          >
            Reset
          </Button>
        </Box>
        <FileUploader />
        <Box sx={{ height: 50, border: '2px solid' }} />
        <MatchColumns />
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={alertSeverity}
            sx={{ width: "100%" }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default Initialise;

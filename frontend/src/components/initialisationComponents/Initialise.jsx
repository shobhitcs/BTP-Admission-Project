import { Button, Snackbar, Alert } from "@mui/material";
import FileUploader from "./FileUploader";
import MatchColumns from "./MatchColumns";
import axios from "axios";
import React, { useState } from "react";

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
    <div className="flex w-full justify-center flex-col items-center gap-6 p-8">
      <div className="flex content-center justify-center w-full gap-6">
        <p className="text-3xl text-gray-400">Initialise The DataBase</p>
        <Button
          variant="outlined"
          onClick={handleReset}
          style={{ color: "white", background: "red" }}
        >
          Reset
        </Button>
      </div>
      <FileUploader />
      <div className="h-[50px] border-2"></div>
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
    </div>
  );
}

export default Initialise;

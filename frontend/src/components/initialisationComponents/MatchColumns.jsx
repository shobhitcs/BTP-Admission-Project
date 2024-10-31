import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box, Typography, Grid, CircularProgress } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import SelectBox from "./SelectBox";
import fileDownload from "js-file-download";
import { applicantsSchemaColumnNames } from "./columnNames";
import TaskIcon from '@mui/icons-material/Task';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const MatchColumns = () => {
  const [columnNamesMatched, setColumnNamesMatched] = useState(null);
  const [optionsColumn, setOptionsColumn] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  useEffect(() => {
    // Fetch initial file status and column details when component mounts
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Check if the file exists
        const statusRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/initialise/getMasterFileModifiedStatus`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        });
        setFileExists(statusRes.data.result);

        if (!statusRes.data.result) {
          // Fetch matched column names if file doesn't exist
          const jwtToken = getCookie("jwtToken");
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/initialise/getMatchedColumnNames`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          // console.log(response.data.result, response.data.options);
          setColumnNamesMatched(response.data.result);
          setOptionsColumn(response.data.options);
        }
        setIsLoading(false);
      } catch (error) {
        handleErrorResponse(error, "Failed to fetch initial data");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const changeColumnNamesMatchedState = (uploadedColumnName, selectedColumnName) => {
    setColumnNamesMatched(prevState => ({
      ...prevState,
      [uploadedColumnName]: selectedColumnName
    }));
  };

  const sendSelectedColumnNames = () => {
    //Code not required after schema change
    // for (const actualColumnName of applicantsSchemaColumnNames) {
    //   let count = 0;
    //   for (const uploadedColumnName of Object.keys(columnNamesMatched)) {
    //     if (columnNamesMatched[uploadedColumnName] === actualColumnName) {
    //       count++;
    //     }
    //   }
    //   if (count >= 2) {
    //     handleError(`${actualColumnName} is Selected Twice`);
    //     return;
    //   }
    //   if (count === 0) {
    //     handleError(`${actualColumnName} is Not Selected`);
    //     return;
    //   }
    // }
    setIsLoading(true);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/initialise/saveToDataBase`, { result: columnNamesMatched }, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        withCredentials: true,
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        handleErrorResponse(err);
        setIsLoading(false);
      });
  };

  const handleDownload = () => {
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/initialise/modifiedFile`, {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          fileDownload(res.data, "modifiedFile.xlsx");
        })
        .catch((err) => {
          handleErrorResponse(err);
        });
    } catch (error) {
      console.error("Error:", error);
      handleError("Failed to download file.");
    }
  };

  const handleErrorResponse = (error, defaultMessage) => {
    const message = (error.response && error.response.data && error.response.data.result) || defaultMessage || "An error occurred";
    handleError(message);
  };

  const handleError = (message) => {
    setAlertMessage(message);
    setAlertSeverity("error");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      {!fileExists && columnNamesMatched !== null && !isLoading && (
        <Box sx={{ padding: 2, maxWidth: '1200px', margin: '0 auto' }}>
          <Grid container spacing={2}>
            {Object.keys(columnNamesMatched).map((columnName) => (
              <Grid item xs={12} sm={6} md={4} key={columnName}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid grey',
                    borderRadius: 1,
                    boxShadow: 1,
                    padding: 1,
                    margin: '0 auto',  // Center align tiles
                    maxWidth: '300px',
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ flex: 1, fontWeight: '600', fontFamily: 'Maven Pro, sans serif', marginBottom: '10px' }}
                  >
                    {columnName}
                  </Typography>
                  <SelectBox
                    uploadedColumnName={columnName}
                    predictedColumnName={columnNamesMatched[columnName]}
                    changeState={changeColumnNamesMatchedState}
                    options = {optionsColumn}
                    sx={{ fontWeight: '600', fontFamily: 'Maven Pro, sans serif' }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}


      {fileExists && !isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
          <TaskIcon sx={{ fontSize: 55, color: 'grey' }} />

          <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'Maven Pro, sans-serif', fontWeight: '600' }}>
            Fields Successfully Saved
          </Typography>
        </Box>
      )}

      {!fileExists && isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, padding: 2 }}>
        {!fileExists && columnNamesMatched !== null && (
          <Button
            variant="contained"
            startIcon={<FileUploadIcon />}
            color="success"
            disabled={isLoading}
            onClick={sendSelectedColumnNames}
            sx={{
              maxWidth: '200px',
              backgroundColor: "#36AA95", // Success green color
              color: "white",
              fontWeight: "bold",
              '&:hover': {
                backgroundColor: "#379777", // Slightly darker green for hover
              },
              '&:active': {
                backgroundColor: "#388E3C", // Even darker green for active state
              }
            }}
          >
            Save To DataBase
          </Button>
        )}

        {fileExists && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            sx={{
              backgroundColor: '#8A2BE2', // Violet background color
              color: '#FFFFFF', // White text color
              '&:hover': {
                backgroundColor: '#7A1FCE', // Darker violet on hover
              },
            }}
          >
            Download The Edited File
          </Button>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MatchColumns;

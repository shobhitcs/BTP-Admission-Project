import React, { useState, useEffect } from "react";
import { Button, Snackbar, Alert, Card, CardContent, CardHeader, Typography, Grid, Box } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import fileDownload from "js-file-download";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useNavigate } from "react-router-dom";
import documentImage from "../../images/docmentimage.jpg";
import MatchColumns from "./MatchColumns";

function Initialise(props) {
  const [file, setFile] = useState(null);
  const [fileExists, setFileExists] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const navigate = useNavigate();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    const checkFileStatus = async () => {
      setIsLoading(true);
      try {
        const jwtToken = getCookie("jwtToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/initialise/getMasterFileUploadStatus`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setFileExists(response.data.result);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkFileStatus();
  }, [navigate]);

  const handleFileSubmit = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.name.split(".").pop() !== "xlsx") {
      setAlertMessage("Invalid file type, please upload an xlsx file");
      setAlertSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/initialise/getFile`,
        formData,
        { withCredentials: true }
      );
      setAlertMessage("File upload successful");
      setAlertSeverity("success");
      setSnackbarOpen(true);
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response && error.response.status === 401) {
        setAlertMessage("File upload failed. Please log in with correct credentials.");
      } else {
        setAlertMessage("File upload failed.");
      }
      setAlertSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDownload = async () => {
    try {
      const token = getCookie("jwtToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/initialise/uploadedFile`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      fileDownload(response.data, "uploadedFile.xlsx");
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleReset = async () => {
    try {
      const jwtToken = getCookie("jwtToken");
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 10px 10px 10px', marginBottom: '40px' }}>
      <Card sx={{ margin: "auto", boxShadow: 3, minWidth: '150px' }}>
        {!fileExists && (<CardHeader
          title="Upload The Master Excel File"
          titleTypographyProps={{ variant: "h6", textAlign: "center", fontFamily: 'Poppins, sans serif' }}
          sx={{ backgroundColor: "#f5f5f5" }}
        />)}
        {fileExists && (<CardHeader
          title="Select Required Fields"
          titleTypographyProps={{ variant: "h6", textAlign: "center", fontFamily: 'Poppins, sans serif' }}
          sx={{ backgroundColor: "#f5f5f5" }}
        />)}
        <CardContent >
          {fileExists && (
            <Box display="flex" justifyContent="center" marginTop="20px">
              <Button
                variant="contained"
                startIcon={<RestartAltIcon />} // Add the Refresh icon here
                onClick={handleReset}
                sx={{
                  // maxWidth: '200px',
                  color: "white",
                  backgroundColor: "#FF3D00", // Red color
                  borderRadius: "6px",
                  padding: "6px 12px",
                  fontWeight: "bold",
                  marginBottom: '40px',
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  textTransform: "none", // Keeps the text as-is, without capitalizing
                  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                  '&:hover': {
                    backgroundColor: "#D50000", // Slightly darker red for hover
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  },
                  '&:active': {
                    backgroundColor: "#B71C1C", // Even darker red for active state
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                  }
                }}
              >
                Reset All
              </Button>
            </Box>
          )}
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            {!fileExists && (
              <>
                <Grid item>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadFileIcon />}
                  >
                    Choose File
                    <input type="file" accept=".xlsx" hidden onChange={handleFileSubmit} />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {file === null ? (
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      align="center"
                      sx={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      No Files Uploaded
                    </Typography>
                  ) : (
                    <Grid container spacing={2} justifyContent="center">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          <b>File Name:</b> {file.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="textSecondary">
                          <b>Type:</b> {file.type}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                {file !== null && (
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center">
                      <Button
                        variant="contained"
                        startIcon={<FileUploadIcon />}
                        fullWidth
                        onClick={uploadFile}
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
                        Upload
                      </Button>
                    </Box>
                  </Grid>
                )}
              </>
            )}
            {fileExists && (
              <MatchColumns />
            )}
          </Grid>
        </CardContent>

      </Card>
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
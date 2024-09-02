import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Box, Card, CardContent, CardHeader, Typography, Grid } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import fileDownload from "js-file-download";
import { useNavigate } from "react-router-dom";
import documentImage from "../../images/docmentimage.jpg";

function FileUploader(props) {
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
  }, []);

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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 800, margin: "auto", boxShadow: 3 }}>
      <CardHeader
        title="Upload The Master Excel File"
        titleTypographyProps={{ variant: "h6", textAlign: "center" }}
        sx={{ backgroundColor: "#f5f5f5" }}
      />
      <CardContent>
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
                  <Typography variant="body1" color="textSecondary" align="center">
                    No Files Uploaded
                  </Typography>
                ) : (
                  <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        <b>File Name:</b> {file.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        <b>Type:</b> {file.type}
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
              {file !== null && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    startIcon={<FileUploadIcon />}
                    fullWidth
                    onClick={uploadFile}
                  >
                    Upload
                  </Button>
                </Grid>
              )}
            </>
          )}
          {fileExists && (
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>
                <img
                  src={documentImage}
                  alt="Not Found"
                  style={{ width: "200px", height: "120px" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" color="textSecondary" align="center">
                  Hmm... looks like you have already uploaded the file.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  fullWidth
                  onClick={handleDownload}
                >
                  Download the Uploaded File
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </CardContent>
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
    </Card>
  );
}

export default FileUploader;

import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  MenuItem,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import GetAppIcon from "@mui/icons-material/GetApp";
import CloseIcon from "@mui/icons-material/Close";
import fileDownload from "js-file-download";
import axios from "axios";

function RoundUpdateFiles(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileExists, setFileExists] = useState(props.isPresent);
  const [coap, setCoap] = useState("");
  const [candidateDecision, setCandidateDecision] = useState("");
  const [columnNames, setColumnNames] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const handleFileSubmit = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.name.split(".").pop() !== "xlsx") {
      setSnackbarMessage("Invalid file type, please upload an .xlsx file");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setFile(selectedFile);
    setColumnNames(null);
  };

  const getColumnNames = () => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      const formData = new FormData();
      formData.append("name", file.name);
      formData.append("file", file);
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/rounds/getColumnNames`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          setColumnNames(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          setSnackbarMessage("Failed to fetch column names.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFile = () => {

    setIsLoading(true);
    if (!coap || !candidateDecision || coap === "" || candidateDecision === "") {
      setSnackbarMessage("Please ensure both COAP Reg Id and Candidate Decision are selected.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
      return; // Exit the function if validation fails
    }
    try {
      const jwtToken = getCookie("jwtToken");
      const formData = new FormData();
      formData.append("name", file.name);
      formData.append("file", file);
      formData.append("coap", coap);
      formData.append("candidateDecision", candidateDecision);

      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/rounds/putFile/${props.fileName}/${props.roundNumber}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          setSnackbarMessage("File uploaded successfully.");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          setFileExists(true);
          setIsLoading(false);
          axios
            .get(`${process.env.REACT_APP_BACKEND_URL}/api/rounds/getRounds`, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              withCredentials: true,
            })
            .then((res) => {
              const r = Array.from({ length: res.data.rounds }, (_, i) => `Round-${i + 1}`);

              // console.log(r.length);
              props.setR(r);
              props.setSRI(r.length - 1);
              // setIsLoading(false);
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          setSnackbarMessage("File upload failed.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setIsLoading(false);
        });



    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = () => {
    axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/rounds/getFile/${props.fileName}/${props.roundNumber}`,
      { responseType: "blob" }
    )
      .then((res) => {
        fileDownload(res.data, `${props.fileName}.xlsx`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Box
      sx={{
        // maxWidth: "800px",
        width: "100%",
        border: 2,
        borderColor: "grey.300",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          backgroundColor: "grey.100",
          py: 1.5,
          textAlign: "center",
          borderBottom: 2,
          borderColor: "grey.300",
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: 'Maven Pro, sans serif', padding: '10px' }}>{props.displayFileName}</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {!fileExists && (
          <Grid container direction="column" spacing={2} alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
              >
                Choose File
                <input
                  type="file"
                  accept=".xlsx"
                  hidden
                  onChange={handleFileSubmit}
                />
              </Button>
            </Grid>
            <Grid item>
              {file === null ? (
                <Typography color="textSecondary" sx={{ fontFamily: 'Monda, sans serif', color: 'red' }}>No Files Uploaded</Typography>
              ) : (
                <Grid container justifyContent="center" spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <b>File Name:</b> {file.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <b>Type:</b> {file.type}
                    </Typography>
                  </Grid>
                </Grid>

              )}
            </Grid>
          </Grid>
        )}
        {fileExists && (
          <Box textAlign="center" my={2}>
            <Typography variant="body1" color="primary" sx={{ fontFamily: 'Monda, sans serif', color: '#347928', marginBottom: '10px' }}>
              File Has Been Uploaded
            </Typography>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              color="success"
            >
              Download
            </Button>
          </Box>
        )}
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {columnNames && !isLoading && !fileExists && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body2" color="red" align="center" sx={{ fontFamily: 'Monda, sans serif', fontSize: 18 }}>
              Please match the columns
            </Typography>
            <Grid container spacing={3} justifyContent="center" mt={2}>
              <Grid item xs={12} sm={6} container justifyContent="center">
                <TextField
                  select
                  label="COAP Reg Id"
                  value={coap}
                  onChange={(e) => setCoap(e.target.value)}
                  fullWidth
                  sx={{ maxWidth: '350px' }}  // Maintain maxWidth for the select field
                >
                  {columnNames.map((label) => (
                    <MenuItem key={label} value={label}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} container justifyContent="center">
                <TextField
                  select
                  label={
                    props.fileName === "IITGOfferedButNotInterested"
                      ? "Other Institute Decision"
                      : "Applicant Decision"
                  }
                  value={candidateDecision}
                  onChange={(e) => setCandidateDecision(e.target.value)}
                  fullWidth
                  sx={{ maxWidth: '350px' }}  // Maintain maxWidth for the select field
                >
                  {columnNames.map((label) => (
                    <MenuItem key={label} value={label}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                startIcon={<FileUploadIcon />}
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
          </Box>

        )}
        {file && !columnNames && !fileExists && (
          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              startIcon={<GetAppIcon />}
              onClick={getColumnNames}
              sx={{
                maxWidth: '300px',
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
              Get Column Names
            </Button>
          </Box>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RoundUpdateFiles;

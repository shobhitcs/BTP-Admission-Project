import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
  Grid,
} from "@mui/material";

function CandidateDisplay() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const { coapid } = useParams();
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const jwtToken = getCookie("jwtToken");
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/search/getinfo/${coapid}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        setData(res.data.result);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrorMessage(err.message);
        setOpen(true);
        setIsLoading(false);
      });
  }, [coapid]);

  const handleUpdate = async () => {
    try {
      const jwtToken = getCookie("jwtToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/candidate/manualUpdate`,
        { coap: coapid },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ padding: '100px 10px 30px 10px' }}>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Box sx={{ maxWidth: "1000px", margin: "auto" }}>
          <Card sx={{ mb: 4, backgroundColor: "#1B3058", color: "white" }}>
            <CardContent>
              <Typography variant="h5" align="center" sx={{ fontFamily: 'Maven pro, sans serif'}}>
                Candidate Details
              </Typography>
            </CardContent>
          </Card>
          {data && (
            <>
              <Grid container spacing={2} justifyContent="center">
                {["FullName", "ApplicationNumber", "COAP"].map((key) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" color="text.secondary">
                          {key}
                        </Typography>
                        <Typography variant="body1">
                          {data[0][key] || "NULL"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Grid container spacing={2} sx={{ mt: 4 }}>
                {Object.keys(data[0])
                  .filter((key) => !["FullName", "ApplicationNumber", "COAP"].includes(key))
                  .map((key) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" color="text.secondary">
                            {key}
                          </Typography>
                          <Typography variant="body2">
                            {data[0][key] || "NULL"}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
              </Grid>
              {data[0]["Accepted"] === "Y" || data[0]["Accepted"] === "R" ? (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Typography variant="h6" sx={{ mr: 2 }}>
                    Update Status:
                  </Typography>
                  <Select
                    value={status}
                    onChange={handleChange}
                    sx={{ mr: 2, minWidth: 200 }}
                  >
                    <MenuItem value={"N"}>Reject</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                  >
                    Update
                  </Button>
                </Box>
              ) : null}
            </>
          )}
        </Box>
      )}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CandidateDisplay;

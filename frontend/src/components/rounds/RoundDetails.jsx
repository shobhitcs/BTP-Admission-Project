import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Snackbar, Alert, Box, Typography, Stack, Card, CardContent, LinearProgress } from "@mui/material";
import Download from "@mui/icons-material/Download";
import fileDownload from "js-file-download";
import RoundUpdateFiles from "./RoundUpdateFiles";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

function RoundDetails({ roundNumber, setR, setSRI }) {
  const [isLoading, setIsLoading] = useState(true);
  const [offersGenerated, setOffersGenerated] = useState(false);
  const [roundStatus, setRoundStatus] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const generateOffers = async () => {
    try {
      setIsLoading(true);
      const jwtToken = getCookie("jwtToken");
      await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/rounds/generateOffers/${roundNumber}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setOffersGenerated(true);
      setIsLoading(false);
    } catch (error) {
      setSnackbarMessage(error.response?.data?.result || "Failed to generate offers");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoundDetails = async () => {
      try {
        setIsLoading(true);
        const jwtToken = getCookie("jwtToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/rounds/getRoundDetails/${roundNumber}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        setOffersGenerated(response.data.result.offersGenerated);
        setRoundStatus(response.data.result);
        setIsLoading(false);
      } catch (error) {
        setSnackbarMessage("Failed to fetch round details");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setIsLoading(false);
      }
    };
    fetchRoundDetails();
  }, [roundNumber]);

  const handleDownloadOffersFile = () => {
    const jwtToken = getCookie("jwtToken");
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/rounds/getFile/${roundNumber}`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        fileDownload(res.data, `round${roundNumber}.xlsx`);
      })
      .catch(() => {
        setSnackbarMessage("Failed to download file");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Card variant="outlined" sx={{ marginBottom: 2 }}>
          {isLoading && (<LinearProgress />)}
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              {!offersGenerated && (<Button
                variant="contained"
                color={offersGenerated ? "warning" : "primary"}
                onClick={generateOffers}
                disabled={isLoading}
                startIcon={offersGenerated ? <AutoModeIcon /> : <AutorenewIcon />}
              >
                {/* {offersGenerated ? "Regenerate" : "Generate"} */}
                Generate
              </Button>)}
              {offersGenerated && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDownloadOffersFile}
                  startIcon={<Download />}
                >
                  Download Offers
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
        <Box sx={{ marginTop: 2 }}>
          <Card variant="outlined" sx={{ p: 2 }} >
            {roundStatus ? (
              <Box>
                {offersGenerated ? (
                  <Stack spacing={2}>
                    <RoundUpdateFiles setR = {setR} setSRI = {setSRI}
                      fileName={"IITGCandidateDecision"}
                      isPresent={roundStatus.IITGCandidateDecision}
                      displayFileName={"IIT Goa Offered Candidate Decision File"}
                      roundNumber={roundNumber}
                    />
                    <RoundUpdateFiles setR = {setR} setSRI = {setSRI}
                      fileName={"IITGOfferedButNotInterested"}
                      displayFileName={"IIT Goa Offered But Accepted At Different Institute File"}
                      isPresent={roundStatus.IITGOfferedButNotInterested}
                      roundNumber={roundNumber}
                    />
                    <RoundUpdateFiles setR = {setR} setSRI = {setSRI}
                      displayFileName={"Consolidated Decision File"}
                      fileName={"ConsolidatedFile"}
                      isPresent={roundStatus.ConsolidatedFile}
                      roundNumber={roundNumber}
                    />
                  </Stack>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                    <PendingActionsIcon sx={{ fontSize: 55, color: 'grey' }} />

                    <Typography variant="body1" color="textSecondary" sx={{ fontFamily: 'Maven Pro, sans-serif', fontWeight: '600' }}>
                      Generate Offers for further Actions
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : null}
          </Card>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RoundDetails;

import React, { useState, useEffect } from "react";
import axios from "axios";
import RoundUpdateFiles from "./RoundUpdateFiles";
import { Button, Snackbar, Alert } from "@mui/material";
import Download from "@mui/icons-material/Download";
import Loader from "../Loader";
import fileDownload from "js-file-download";

function RoundDetails(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [offersGenerated, setOffersGenerated] = useState(false);
  const [roundStatus, setRoundstatus] = useState(null);
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
        `${process.env.REACT_APP_BACKEND_URL}/api/rounds/generateOffers/${props.roundNumber}`,
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
      console.log(error);
      setSnackbarMessage(error.response.data.result || "Failed to generate offers");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      setIsLoading(true);
      const jwtToken = getCookie("jwtToken");
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/rounds/getRoundDetails/${props.roundNumber}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          setOffersGenerated(res.data.result.offersGenerated);
          setRoundstatus(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  }, [props.roundNumber]);

  const handleDownloadOffersFile = () => {
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/rounds/getFile/${props.roundNumber}`,
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
          fileDownload(res.data, `round${props.roundNumber}.xlsx`);
        })
        .catch((err) => {
          console.log(err);
          setSnackbarMessage("Failed to download file");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        });
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to download file");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="w-full flex flex-col justify-center items-center h-auto p-3">
          <div className="flex w-[95%] border-2 h-[60px] mt-5 items-center justify-between p-3 bg-zinc-50 shadow-md rounded-md">
            <p className="text-xl text-[#1B3058]">
              {offersGenerated ? "Offers Have Been Generated" : "Generate Offers"}
            </p>
            <div className="flex w-[70%] justify-end items-center gap-5">
              <Button variant="contained" onClick={generateOffers}>
                {offersGenerated ? "Regenerate" : "Generate"}
              </Button>
              {offersGenerated && (
                <Button
                  variant="contained"
                  endIcon={<Download />}
                  onClick={handleDownloadOffersFile}
                >
                  Download
                </Button>
              )}
            </div>
          </div>
          <div className="h-10 border-2"></div>
          <div className="flex flex-col w-full items-center justify-center">
            <h1 className="text-2xl flex w-[95%] justify-center  p-2 bg-[#1B3058] text-yellow-400">
              Updates From Round
            </h1>

            {roundStatus && offersGenerated && (
              <div className="flex flex-col justify-center items-center w-[95%]  h-auto box-border p-3 rounded-md gap-2 border-2">
                <RoundUpdateFiles
                  fileName={"IITGCandidateDecision"}
                  isPresent={roundStatus.IITGCandidateDecision}
                  displayFileName={"IIT Goa Offered Candidate Decision File"}
                  roundNumber={props.roundNumber}
                />
                <div className="h-6 border-2"></div>
                <RoundUpdateFiles
                  fileName={"IITGOfferedButNotInterested"}
                  displayFileName={
                    "IIT Goa Offered But Accepted At Different Institute File"
                  }
                  isPresent={roundStatus.IITGOfferedButNotInterested}
                  roundNumber={props.roundNumber}
                />
                <div className="h-6 border-2"></div>
                <RoundUpdateFiles
                  displayFileName={"Consolidated Decision File"}
                  fileName={"ConsolidatedFile"}
                  isPresent={roundStatus.ConsolidatedFile}
                  roundNumber={props.roundNumber}
                />
              </div>
            )}
            {roundStatus && !offersGenerated && (
              <div className="flex flex-col justify-center items-center w-[95%]  h-auto box-border p-3 shadow-md rounded-md gap-2">
                <p className="text-2xl text-red-500">Please Generate Offers</p>
              </div>
            )}
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RoundDetails;

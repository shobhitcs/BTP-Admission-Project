import React, { useState } from "react";
import { useEffect } from "react";
import { serverLink } from "../../serverLink";
import axios from "axios";
import RoundUpdateFiles from "./RoundUpdateFiles";
import { Button } from "@mui/material";
import Download from "@mui/icons-material/Download";
import Loader from "../Loader";
import fileDownload from "js-file-download";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RoundDetails(props) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const [isLoading, setIsLoading] = useState(true);
  const [offersGenerated, setOffersGenerated] = useState(false);
  // const [updatedStatus,setUpdatedStatus]=useState(false);
  const [roundStatus, setRoundstatus] = useState(null);
  const generateoffers = async () => {
    try {
      setIsLoading(true);
      const jwtToken = getCookie("jwtToken");
      let res = await axios.get(
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
      // alert(error.response.data.result);
      toast.error(error.response.data.result, {
        position: "top-center",
        autoClose: true, // Do not auto-close
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          // Handle closing event
          // console.log("User closed the notification");
        },
      });
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
          // console.log(res.data.result);
          setOffersGenerated(res.data.result.offersGenerated);
          // setUpdatedStatus(res.data.result.updatedRound);
          setRoundstatus(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

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
          // console.log(res);s
          fileDownload(res.data, `round${props.roundNumber}.xlsx`);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-auto flex justify-center items-center">
      <ToastContainer />
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="w-full flex flex-col justify-center items-center h-auto p-3">
          <div className="flex w-[95%] border-2 h-[60px] mt-5 items-center justify-between p-3 bg-zinc-50 shadow-md rounded-md">
            {!offersGenerated && (
              <p className="text-xl text-[#1B3058]">Generate Offers</p>
            )}
            {offersGenerated && (
              <p className="text-xl text-[#1B3058]">
                Offers Have Been Generated
              </p>
            )}
            <div className="flex w-[70%] justify-end items-center gap-5">
              {!offersGenerated && (
                <Button variant="contained" onClick={generateoffers}>
                  Generate
                </Button>
              )}
              {offersGenerated && (
                <Button variant="contained" onClick={generateoffers}>
                  Regenerate
                </Button>
              )}
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

            {roundStatus != null && offersGenerated && (
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
                {roundStatus != null && !offersGenerated && (
                  <p>Offers Not Generated</p>
                )}
              </div>
            )}
            {roundStatus != null && !offersGenerated && (
              <div className="flex flex-col justify-center items-center w-[95%]  h-auto box-border p-3 shadow-md rounded-md gap-2">
                <p className="text-2xl text-red-500">Please Generate Offers</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RoundDetails;

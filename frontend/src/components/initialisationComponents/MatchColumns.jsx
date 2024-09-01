import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Snackbar, Alert } from "@mui/material";
import { applicantsSchemaColumnNames } from "./columnNames";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import SelectBox from "./SelectBox";
import axios from "axios";
import Loader from "../Loader";
import DownloadIcon from "@mui/icons-material/Download";
import documentImage from "../../images/docmentimage.jpg";
import fileDownload from "js-file-download";

const MatchColumns = () => {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const [columnNamesMatched, setColumnNamesMatched] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileExists, setFileExists] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/initialise/getMasterFileModifiedStatus`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.result);
        setFileExists(res.data.result);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  const changeColumnNamesMatchedState = (
    uploadedcolumnName,
    selectedColumnName
  ) => {
    const prevState = columnNamesMatched;
    prevState[uploadedcolumnName] = selectedColumnName;
    setColumnNamesMatched({ ...prevState });
  };

  const getMatchedColumnNames = async () => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/initialise/getMatchedColumnNames`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response.data.result);
      setColumnNamesMatched(response.data.result);
      setIsLoading(false);
    } catch (error) {
      handleErrorResponse(error, "You haven't uploaded the file");
      setIsLoading(false);
    }
  };

  const sendSelectedColumnNames = () => {
    for (const actualColumnName of applicantsSchemaColumnNames) {
      let count = 0;
      for (const uploadedColumnName of Object.keys(columnNamesMatched)) {
        if (columnNamesMatched[uploadedColumnName] === actualColumnName) {
          count++;
        }
      }
      if (count >= 2) {
        handleError(`${actualColumnName} is Selected Twice`);
        return;
      }
      if (count === 0) {
        handleError(`${actualColumnName} is Not Selected`);
        return;
      }
    }
    setIsLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}/api/initialise/saveToDataBase`,
        { result: columnNamesMatched },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        }
      )
      .then((res) => {
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
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/initialise/modifiedFile`,
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            withCredentials: true,
          }
        )
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
    const message =
      (error.response && error.response.data && error.response.data.result) ||
      defaultMessage ||
      "An error occurred";
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
    <div className="flex flex-col max-w-[800px] min-w-[80%] shadow-lg rounded-xl ">
      <div className="flex justify-center items-center w-full h-11 bg-zinc-100 rounded-t-xl gap-10">
        <p className="text-xl text-black">Match The Columns</p>
      </div>
      {!fileExists && columnNamesMatched !== null && !isLoading && (
        <div className="flex justify-center rounded-b-xl items-center gap-2 p-2 box-border h-[500px] flex-wrap overflow-y-scroll">
          {!fileExists &&
            columnNamesMatched != null &&
            Object.keys(columnNamesMatched).map((columnName) => {
              return (
                <div className="w-[250px] flex flex-col justify-center rounded-md p-2 shadow-md">
                  <p className="text-md text-gray-400">{columnName}</p>
                  <SelectBox
                    uploadedColumnName={columnName}
                    predictedColumnName={columnNamesMatched[columnName]}
                    changeState={changeColumnNamesMatchedState}
                  />
                </div>
              );
            })}
        </div>
      )}
      {fileExists && !isLoading && (
        <div className="flex items-center flex-col h-[180px] gap-1">
          <img
            src={documentImage}
            alt="Not Found"
            style={{ width: "200px", height: "120px" }}
          />
          <p className="text-xl text-grey ">
            Hmm looks like you have already Matched the Columns
          </p>
        </div>
      )}
      {!fileExists && columnNamesMatched === null && !isLoading && (
        <div className="flex justify-center rounded-b-xl items-center gap-2 p-2 box-border h-[100px] flex-wrap">
          <p className="text-xl">Press The button to get Data</p>
        </div>
      )}
      {!fileExists && isLoading && (
        <div className="flex w-full justify-center items-center">
          <Loader />
        </div>
      )}

      <div className="w-full p-2 flex justify-center">
        {!fileExists && columnNamesMatched != null && (
          <Button
            variant="contained"
            startIcon={<FileUploadIcon />}
            style={{ margin: "auto", marginBottom: "5px" }}
            onClick={sendSelectedColumnNames}
          >
            Save To DataBase
          </Button>
        )}
        {!fileExists && columnNamesMatched == null && (
          <Button
            variant="contained"
            onClick={getMatchedColumnNames}
            style={{ margin: "auto", marginBottom: "5px" }}
          >
            Get Column Names
          </Button>
        )}
        {fileExists && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            style={{ margin: "auto", marginBottom: "5px" }}
            onClick={handleDownload}
          >
            Download The Edited File
          </Button>
        )}
      </div>

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
};

export default MatchColumns;

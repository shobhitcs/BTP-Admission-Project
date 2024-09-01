import { Autocomplete, Button, TextField, Snackbar, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "@mui/icons-material/Search";
import FilteredCandidatesTable from "./FilteredCandidatesTable";
import { useNavigate } from "react-router-dom";

function FilterOptions(props) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const navigate = useNavigate();
  const genderLabels = [{ label: "Male" }, { label: "Female" }];
  const CategoryLabels = [
    { label: "GEN" },
    { label: "OBC" },
    { label: "SC" },
    { label: "ST" },
  ];

  const [data, setData] = useState([]);
  const [coapId, setcoapId] = useState(null);
  const [gender, setGender] = useState(null);
  const [category, setCategory] = useState(null);
  const [coapIds, setCoapIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/search/getCoapIds`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        })
        .then((res) => {
          setCoapIds(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            navigate("/");
          } else {
            setSnackbarMessage(err.message);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [navigate]);

  const getData = () => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/search/getinfo`,
          { category: category, gender: gender, coapId: coapId },
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
          setSnackbarMessage(err.message);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full justify-start items-center  h-fit">
      <div className="w-full flex justify-center">
        <p className="text-3xl text-gray-400">Search</p>
      </div>
      <div className="flex justify-between align-center w-[90%] h-fit border-[1px] box-border p-1 bg-zinc-100">
        <div>
          <Autocomplete
            value={coapId}
            onChange={(event, newValue) => {
              setcoapId(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={coapIds}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="COAP ID" />}
          />
        </div>
        <div>
          <Autocomplete
            value={category}
            onChange={(event, newValue) => {
              setCategory(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={CategoryLabels}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
        </div>
        <div>
          <Autocomplete
            value={gender}
            onChange={(event, newValue) => {
              setGender(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={genderLabels}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Gender" />}
          />
        </div>
        <div className="flex items-center">
          <Button variant="contained" endIcon={<Search />} onClick={getData}>
            Search
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <p className="text-3xl text-gray-400">Filtered Results</p>
      </div>
      <FilteredCandidatesTable data={data} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default FilterOptions;

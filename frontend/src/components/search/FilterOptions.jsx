import {
  Autocomplete,
  Button,
  TextField,
  Snackbar,
  Alert,
  Container,
  Box,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "@mui/icons-material/Search";
import FilteredCandidatesTable from "./FilteredCandidatesTable";
import { useNavigate } from "react-router-dom";

function FilterOptions() {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const genderLabels = [{ label: "Male" }, { label: "Female" }];
  const categoryLabels = [
    { label: "GEN" },
    { label: "OBC" },
    { label: "SC" },
    { label: "ST" },
  ];

  const [data, setData] = useState([]);
  const [coapId, setCoapId] = useState(null);
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
  }, [navigate]);

  const getData = () => {
    setIsLoading(true);
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
  };

  return (
    <Container sx={{ padding: "100px 10px 40px 10px" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: isMobile ? 2 : 1,
        }}
      >
        <Autocomplete
          value={coapId}
          onChange={(event, newValue) => setCoapId(newValue)}
          disablePortal
          id="coap-id-autocomplete"
          options={coapIds}
          sx={{ width: isMobile ? "100%" : "30%" }}
          renderInput={(params) => <TextField {...params} label="COAP ID" />}
        />
        <Autocomplete
          value={category}
          onChange={(event, newValue) => setCategory(newValue)}
          disablePortal
          id="category-autocomplete"
          options={categoryLabels}
          sx={{ width: isMobile ? "100%" : "30%" }}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />
        <Autocomplete
          value={gender}
          onChange={(event, newValue) => setGender(newValue)}
          disablePortal
          id="gender-autocomplete"
          options={genderLabels}
          sx={{ width: isMobile ? "100%" : "30%" }}
          renderInput={(params) => <TextField {...params} label="Gender" />}
        />

      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={getData}
          startIcon={<Search />} // Adds the Search icon before the text
          sx={{ fontSize: "1rem" }}
        >
          Search Details
        </Button>
      </Box>
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
    </Container>
  );
}

export default FilterOptions;

import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import RoundDetails from "./RoundDetails";
import { useNavigate } from "react-router-dom";

function Rounds() {
  const navigate = useNavigate();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const [rounds, setRounds] = useState([]);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const jwtToken = getCookie("jwtToken");
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
        setRounds(r);
        setSelectedRoundIndex(r.length - 1);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          navigate("/");
        }
      });
  }, [navigate]);

  const handleReset = () => {
    setIsLoading(true);
    const jwtToken = getCookie("jwtToken");
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/api/rounds/reset/${selectedRoundIndex + 1}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      .then(() => {
        window.location.reload();
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column",   alignItems: "center", padding: "100px 10px 30px 10px" }}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Select
              labelId="round-select-label"
              value={selectedRoundIndex}
              onChange={(e) => setSelectedRoundIndex(e.target.value)}
              sx={{ minWidth: '300px', margin : 'auto'}}
            >
              {rounds.map((roundName, index) => (
                <MenuItem key={index} value={index}>
                  {roundName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#1B3058",
              p: 2,
              borderRadius: 1,
              color: "yellow",
            }}
          >
            <Typography variant="h5">
              Round-{selectedRoundIndex + 1} Details
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <RoundDetails roundNumber={selectedRoundIndex + 1} />
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default Rounds;

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import SeatMatrixRow from "./SeatMatrixRow";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SeatMatrix() {
  const navigate = useNavigate();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);

  // Snackbar states
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
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/seatMatrix/seatMatrixData`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          setData(res.data.result);
          setRows(res.data.result.map(({ category, seatsAllocated, seatsBooked }) => ({
            category,
            seats: seatsAllocated,
            seatsBooked,
          })));
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            navigate("/");
          } else {
            setSnackbarMessage(err.response.data.error);
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

  const handleSeatsChange = (category, newSeats) => {
    setRows(prevRows =>
      prevRows.map(row =>
        row.category === category ? { ...row, seats: newSeats } : row
      )
    );
  };

  const handleSaveAll = async () => {
    try {
      const jwtToken = getCookie("jwtToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/seatMatrix/updateSeatsBulk`,
        rows,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSnackbarMessage("Seats successfully updated!");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error(error);
      setSnackbarMessage("An error occurred while saving the data.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, mt: 4, mb: 4, padding: '80px 10px 10px 10px' }}>
      {!isLoading && (
        <>
          <TableContainer component={Paper} sx={{ maxWidth: "1400px" }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="seat matrix">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#343131", height: 70 }}>
                  <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif' }} align="center">
                    Category
                  </TableCell>
                  <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif' }} align="center">
                    Seats Allocated
                  </TableCell>
                  <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif' }} align="center">
                    Seats Booked
                  </TableCell>
                  <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif' }} align="center">
                    Set Seats
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <SeatMatrixRow
                    key={row.category}
                    category={row.category}
                    seatsAllocated={row.seats}
                    seatsBooked={row.seatsBooked}
                    onSeatsChange={handleSeatsChange}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            onClick={handleSaveAll}
            style={{ background: "#36AA95", marginTop: "20px" }}
          >
            Update All
          </Button>
        </>
      )}
      {isLoading && (
        <Box sx={{ height: "80vh", display: "flex", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SeatMatrix;

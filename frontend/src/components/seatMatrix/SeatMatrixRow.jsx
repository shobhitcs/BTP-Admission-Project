import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Button, TextField, Snackbar, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";

function SeatMatrixRow(props) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const [seats, setSeats] = useState(props.seatsAllocated);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangeSeats = (e) => {
    setSeats(e.target.value);
  };

  const handleSave = async () => {
    if (seats < props.seatsBooked) {
      setErrorMessage("Seats booked are more than the seats allocated");
      setOpen(true);
      return;
    }

    try {
      const jwtToken = getCookie("jwtToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/seatMatrix/updateSeats`,
        { category: props.category, seats: seats },
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
      setErrorMessage("An error occurred while saving the data.");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <TableRow
        key={"key"}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell
          component="th"
          scope="row"
          style={{ fontSize: "15px", fontWeight: "bold", color: "#FFCB00" }}
        >
          {props.category}
        </TableCell>
        <TableCell align="center">{props.seatsAllocated}</TableCell>
        <TableCell align="center">{props.seatsBooked}</TableCell>
        <TableCell align="center">
          <TextField
            type="Number"
            onChange={handleChangeSeats}
            value={seats}
          ></TextField>
        </TableCell>
        <TableCell align="center">
          <Button
            variant="contained"
            onClick={handleSave}
            style={{ background: "#1B3058" }}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </TableCell>
      </TableRow>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SeatMatrixRow;

import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { Button, TextField } from "@mui/material";
import { serverLink } from "../../serverLink";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SeatMatrixRow(props) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const [seats, setSeats] = useState(props.seatsAllocated);
  const handleChangeSeats = (e) => {
    setSeats(e.target.value);
  };
  const handleSave = async () => {
    if (seats < props.seatsBooked) {
      toast.error("Seats booked are more than the seats allocated", {
        position: "top-center",
        autoClose: true, // Do not auto-close
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    try {
      const jwtToken = getCookie("jwtToken");
      const response = await axios.post(
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
      // console.log(response);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
  );
}

export default SeatMatrixRow;

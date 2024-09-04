import React, { useState, useEffect } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TextField } from "@mui/material";

function SeatMatrixRow({ category, seatsAllocated, seatsBooked, onSeatsChange }) {
  const [seats, setSeats] = useState(seatsAllocated);

  useEffect(() => {
    setSeats(seatsAllocated); // Update local state when props change
  }, [seatsAllocated]);

  const handleChangeSeats = (e) => {
    setSeats(e.target.value);
    onSeatsChange(category, e.target.value); // Notify parent of the change
  };

  return (
    <TableRow key={category} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row" style={{ fontSize: "15px", fontWeight: "bold", color: "#343131" }}>
        {category}
      </TableCell>
      <TableCell align="center">{seatsAllocated}</TableCell>
      <TableCell align="center">{seatsBooked}</TableCell>
      <TableCell align="center">
        <TextField type="number" onChange={handleChangeSeats} value={seats} />
      </TableCell>
    </TableRow>
  );
}

export default SeatMatrixRow;

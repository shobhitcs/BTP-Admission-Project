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
      <TableCell align="center">
        <TextField type="number" onChange={handleChangeSeats} value={seats} />
      </TableCell>
      <TableCell align="center">{seatsAllocated}</TableCell>
      <TableCell align="center">{seatsBooked}</TableCell>
    </TableRow>
  );
}

export default SeatMatrixRow;



// --------------------- OLD CODE ---------------------
// import React, { useState } from "react";
// import TableCell from "@mui/material/TableCell";
// import TableRow from "@mui/material/TableRow";
// import { Button, TextField, Snackbar, Alert } from "@mui/material";
// import SaveIcon from "@mui/icons-material/Save";
// import axios from "axios";

// function SeatMatrixRow(props) {
//   function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
//   }

//   const [seats, setSeats] = useState(props.seatsAllocated);
//   const [savedSeats, setSavedSeats] = useState(props.seatsAllocated);
//   const [open, setOpen] = useState(false);
//   const [alertType, setAlertType] = useState("success");
//   const [message, setMessage] = useState("");

//   const handleChangeSeats = (e) => {
//     setSeats(e.target.value);
//   };

//   const handleSave = async () => {
//     if (seats < props.seatsBooked) {
//       setMessage("Seats booked are more than the seats allocated");
//       setAlertType("error");
//       setOpen(true);
//       return;
//     }

//     try {
//       const jwtToken = getCookie("jwtToken");
//       await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/api/seatMatrix/updateSeats`,
//         { category: props.category, seats: seats },
//         {
//           headers: {
//             Authorization: `Bearer ${jwtToken}`,
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           withCredentials: true,
//         }
//       );
//       setSavedSeats(seats); // Update the savedSeats state to reflect the new value
//       setMessage("Seats successfully updated!");
//       setAlertType("success");
//     } catch (error) {
//       console.log(error);
//       setMessage("An error occurred while saving the data.");
//       setAlertType("error");
//     } finally {
//       setOpen(true);
//     }
//   };

//   const handleClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpen(false);
//   };

//   return (
//     <>
//       <TableRow
//         key={props.category}
//         sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//       >
//         <TableCell
//           component="th"
//           scope="row"
//           style={{ fontSize: "15px", fontWeight: "bold", color: "#343131" }}
//         >
//           {props.category}
//         </TableCell>
//         <TableCell align="center">{savedSeats}</TableCell>
//         <TableCell align="center">{props.seatsBooked}</TableCell>
//         <TableCell align="center">
//           <TextField
//             type="Number"
//             onChange={handleChangeSeats}
//             value={seats}
//           ></TextField>
//         </TableCell>
//         <TableCell align="center">
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             style={{ background: "#36AA95" }}
//             startIcon={<SaveIcon />}
//           >
//             Update
//           </Button>
//         </TableCell>
//       </TableRow>

//       <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
//         <Alert onClose={handleClose} severity={alertType} sx={{ width: "100%" }}>
//           {message}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// }

// export default SeatMatrixRow;
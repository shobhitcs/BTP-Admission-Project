import React, { useEffect, useState } from "react";
import { TableCell,TableRow, Snackbar, Alert, CircularProgress, Box, Button, Typography } from "@mui/material";
import SeatMatrixRow from "./SeatMatrixRow";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
          setRows(
            res.data.result.map(({ category, seatsAllocated, seatsBooked }) => ({
              category,
              seats: seatsAllocated,
              seatsBooked,
            }))
          );
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
    setRows((prevRows) =>
      prevRows.map((row) =>
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

  // List of main categories
  const mainCategories = ["COMMON_PWD", "EWS", "GEN", "OBC", "SC", "ST"];

  const getSubcategories = (mainCategory) => {
    return rows.filter((row) => row.category.startsWith(mainCategory));
  };

  // Function to generate the summary string for each main category
  const generateCategorySummary = (mainCategory) => {
    const subcategories = getSubcategories(mainCategory);
    return subcategories
      .filter((subcategory) => subcategory.seats > 0) // Only include non-zero seat allocations
      .map(
        (subcategory) =>
          `${subcategory.category} (${subcategory.seats})`
      )
      .join("  "); // Add extra space between subcategories
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        mt: 4,
        mb: 4,
        padding: "80px 10px 10px 10px",
      }}
    >
      {!isLoading && (
        <>
          {mainCategories.map((mainCategory) => (

            <Accordion key={mainCategory.id} sx={{
              width: '80%',
              minHeight: '60px',
            }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',      
                  width: '100%',             
                  padding: 1        
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',      
                    width: '100%',
                    fontSize: 18, color: "", fontFamily: 'Maven Pro, sans-serif'
                  }}
                >
                  <Typography fontWeight="bold" sx={{fontSize: 19, marginRight:1}}>{`${mainCategory} :`}</Typography>
                  {generateCategorySummary(mainCategory)}
                </Box>
                
              </AccordionSummary>
              <AccordionDetails sx={{ backgroundColor: '' }}>
                <TableRow key={123} sx={{ backgroundColor: "", minWidth: "90%" }}>
                  <TableCell component="th" scope="row" style={{ fontSize: 18, color: "", fontFamily: 'Maven Pro, sans-serif', width: "40%", }}>
                    Category
                  </TableCell>
                  <TableCell align="center" style={{fontSize: 18, color: "", fontFamily: 'Maven Pro, sans-serif', width: "20%" }}>
                    Set Seats
                  </TableCell>
                  <TableCell align="center" style={{fontSize: 18, color: "", fontFamily: 'Maven Pro, sans-serif', width: "20%" }}>Seats Allocated</TableCell>
                  <TableCell align="center" style={{fontSize: 18, color: "", fontFamily: 'Maven Pro, sans-serif', width: "20%", }}>Seats Booked</TableCell>
                </TableRow>

                {getSubcategories(mainCategory).map((row) => (
                  <SeatMatrixRow
                    key={row.category} // Make sure each row has a unique category
                    category={row.category}
                    seatsAllocated={row.seats}
                    seatsBooked={row.seatsBooked}
                    onSeatsChange={handleSeatsChange}
                  />
                ))}
              </AccordionDetails>
            </Accordion>

          ))}

          {/*  Update all at once feature */}
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
    </Box>
  );
}

export default SeatMatrix;





//  --------------------- OLD CODE ---------------------
// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Snackbar,
//   Alert,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import SeatMatrixRow from "./SeatMatrixRow";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function SeatMatrix(props) {
//   const navigate = useNavigate();

//   function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
//   }

//   const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState(null);

//   // Snackbar states
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarSeverity, setSnackbarSeverity] = useState("error");

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   useEffect(() => {
//     setIsLoading(true);
//     try {
//       const jwtToken = getCookie("jwtToken");
//       axios
//         .get(
//           `${process.env.REACT_APP_BACKEND_URL}/api/seatMatrix/seatMatrixData`,
//           {
//             withCredentials: true,
//             headers: {
//               Authorization: `Bearer ${jwtToken}`,
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//           }
//         )
//         .then((res) => {
//           setData(res.data.result);
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           if (err.response && err.response.status === 401) {
//             navigate("/");
//           } else {
//             setSnackbarMessage(err.response.data.error);
//             setSnackbarSeverity("error");
//             setSnackbarOpen(true);
//           }
//           setIsLoading(false);
//         });
//     } catch (error) {
//       console.error(error);
//       setIsLoading(false);
//     }
//   }, [navigate]);

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: 3,
//         mt: 4,
//         mb: 4,
//         padding: '80px 10px 10px 10px'
//       }}
//     >
//       {/* <Typography variant="h4" color="textSecondary">
//         Seat Matrix
//       </Typography> */}
//       {!isLoading && (
//         <TableContainer component={Paper} sx={{ maxWidth: "1400px" }}>
//           <Table sx={{ minWidth: 650 }} size="small" aria-label="seat matrix">
//             <TableHead>
//               <TableRow sx={{ backgroundColor: "#343131", height: 70 }}>
//                 <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif', }} align="center">
//                   Category
//                 </TableCell>
//                 <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif', }} align="center">
//                   Seats Allotted
//                 </TableCell>
//                 <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif', }} align="center">
//                   Seats Booked
//                 </TableCell>
//                 <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif', }} align="center">
//                   Set Seats
//                 </TableCell>
//                 <TableCell sx={{ fontSize: 18, color: "white", fontFamily: 'Maven Pro, sans-serif', }} align="center">
//                   Save
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data &&
//                 data.map(({ category, seatsAllocated, seatsBooked }, index) => (
//                   <SeatMatrixRow
//                     key={index}
//                     category={category}
//                     seatsAllocated={seatsAllocated}
//                     seatsBooked={seatsBooked}
//                   />
//                 ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//       {isLoading && (
//         <Box sx={{ height: "80vh", display: "flex", alignItems: "center" }}>
//           <CircularProgress />
//         </Box>
//       )}
//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbarSeverity}
//           sx={{ width: "100%" }}
//         >
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }

// export default SeatMatrix;
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import SeatMatrixRow from "./SeatMatrixRow";
import { serverLink } from "../../serverLink";
import Loader from "../Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SeatMatrix(props) {
  const navigate = useNavigate();
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

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
          // console.log(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          if (err.response && err.response.status === 401) {
            navigate("/");
          } else {
            // console.log(err);
            toast.error(err.response.data.error, {
              position: "top-center",
              autoClose: true,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
            });
          }
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex justify-center w-full flex-col items-center gap-10 mt-8 mb-8">
      <ToastContainer />
      <div className="w-full flex justify-center">
        <p className="text-3xl text-gray-400">Seat Matrix</p>
      </div>
      {!isLoading && (
        <TableContainer component={Paper} style={{ width: "80%" }}>
          <Table
            sx={{ minWidth: 650 }}
            size="small"
            aria-label="a dense table"
            className="w-1/2"
          >
            <TableHead>
              <TableRow style={{ background: "#1B3058", height: "70px" }}>
                <TableCell style={{ fontSize: "18px", color: "white" }}>
                  Category
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "18px", color: "white" }}
                >
                  Seats Alloted
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "18px", color: "white" }}
                >
                  Seats Booked
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "18px", color: "white" }}
                >
                  Set Seats
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontSize: "18px", color: "white" }}
                >
                  Options
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data != null &&
                data.map(({ category, seatsAllocated, seatsBooked }, index) => {
                  return (
                    <SeatMatrixRow
                      key={index}
                      category={category}
                      seatsAllocated={seatsAllocated}
                      seatsBooked={seatsBooked}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isLoading && (
        <div className="h-[80vh]">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default SeatMatrix;

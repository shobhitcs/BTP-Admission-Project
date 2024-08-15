import React, { useState, useEffect } from "react";
import "../input.css";
import iitgoalogo from "../images/Indian_Institute_of_Technology_Goa_Logo.svg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconButton, Tooltip } from "@material-ui/core";
import {
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  AccountBalance as AccountBalanceIcon,
} from "@material-ui/icons";

import axios from "axios";

function NavBar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState({ token: false });

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      const jwtToken = getCookie("jwtToken");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/check-authentication/`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        if (response.data.isAuthenticated) {
          // console.log("the response is: ", response.data);
          setAuth({
            token: true,
            username: response.data.username,
            branch: response.data.branch,
            isAdmin: response.data.isAdmin,
          });
        } else {
          // console.log("Not Authenticated");
          setAuth({ token: false });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuth({ token: false });
      }
    };
    checkAuthentication();
  }, [location]);

  const handleSignOut = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/auth/signout`,
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response);
      if (response.status === 200) {
        // Remove JWT token from localStorage
        localStorage.removeItem("jwtToken");
        // Signout successful, redirect to login page
        navigate("/");
      } else {
        // Handle signout error
        console.error("Signout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <nav className="flex justify-start items-center h-20 box shadow-md  px-8 gap-8 bg-[#1B3058] w-full">
      <Link to="/home">
        <div className=" h-full flex justify-center items-center gap-2 ">
          <img
            src={iitgoalogo}
            alt={"not found"}
            className=" shadow-lg bg-white"
            style={{ width: "70px", height: "70px", borderRadius: "50%" }}
          ></img>
          <div className="flex justify-center items-center">
            <p className="text-xl text-white">IIT Goa</p>
          </div>
        </div>
      </Link>
      {auth.token && (
        <div className="flex items-center">
          <PersonIcon style={{ fontSize: 24, color: "white" }} />
          <div className="text-white font-bold text-lg ml-2">
            {auth.username}
          </div>

          {!auth.isAdmin && (
            <>
              <AccountBalanceIcon
                style={{ fontSize: 24, color: "white", marginLeft: "10px" }}
              />
              <div className="text-white font-bold text-lg ml-2">
                {auth.branch}
              </div>
            </>
          )}
        </div>
      )}

      {auth.token && (
        <div className="w-[fit-content] h-full flex justify-center items-center gap-4 ml-auto">
          {auth.isAdmin ? null : (
            <>
              <Link to="/home">
                <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
                  <p className="text-lg text-white">Home</p>
                </button>
              </Link>
              <Link to="/initialise">
                <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
                  <p className="text-lg text-white">Initialisation</p>
                </button>
              </Link>
              <Link to="/seatMatrix">
                <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
                  <p className="text-lg text-white">SeatMatrix</p>
                </button>
              </Link>
              <Link to="/rounds">
                <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
                  <p className="text-lg text-white">Rounds</p>
                </button>
              </Link>
              <Link to="/search">
                <button className="flex h-full p-2 justify-center items-center hover:border-b-4">
                  <p className="text-lg text-white">Search</p>
                </button>
              </Link>
            </>
          )}
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleSignOut}>
              <p className="text-white text-base  font-bold">Log Out </p>
              <ExitToAppIcon style={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </div>
      )}

      {!auth.token && (
        <div className="w-[fit-content] h-full flex justify-center items-center gap-4 ml-auto">
          <Link to="/">
            <button className="flex h-full p-2 justify-center items-center bg-white  border border-[#1B3058]-500  hover:bg-blue-500 hover:text-white transition duration-300">
              <p className="text-lg text-[#1B3058]-500 font-semibold">Login</p>
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;

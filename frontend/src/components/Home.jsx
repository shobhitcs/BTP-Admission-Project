import React, { useState, useEffect } from "react";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import StartSharpIcon from "@mui/icons-material/StartSharp";
import WifiProtectedSetupSharpIcon from "@mui/icons-material/WifiProtectedSetupSharp";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Home(props) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState(null);

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
        console.log("the response is: ", response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("User is not authenticated. Navigating to '/'...");
          navigate("/");
        } else {
          console.error("Error checking authentication:", error);
        }
      }
    };
    checkAuthentication();
  }, []);

  // const handleButtonClick = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:4444/api/check-authentication/",
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     setApiResponse(response.data);
  //     console.log("API Response:", response.data);
  //   } catch (error) {
  //     console.error("Error fetching API:", error);
  //   }
  // };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-20">
      <div className="m-auto mt-7">
        <p className="text-[40px]">Home</p>
      </div>
      <div className="w-[90%] h-full flex items-center justify-center gap-[150px] p-6 rounded-xl border-4 flex-wrap">
        <Link to="/initialise">
          <div className="w-[200px] h-[200px]  rounded-xl flex flex-col shadow-md hover:shadow-lg">
            <div className="w-full h-[80%] flex justify-center items-start p-4 text-[#1B3058] flex-col">
              <p className="text-[30px]">Initialisation</p>
              <p className="text-[15px] text-gray-400">
                Initialise the database to generate offers
              </p>
            </div>
            <div className="w-full flex justify-end p-4">
              <StartSharpIcon fontSize="large" className="text-[#1B3058] " />
            </div>
          </div>
        </Link>
        <Link to="/seatmatrix">
          <div className="w-[200px] h-[200px]  rounded-xl flex flex-col shadow-md hover:shadow-lg">
            <div className="w-full h-[80%] flex justify-center items-start p-4 text-[#1B3058] flex-col">
              <p className="text-[30px]">Seat Matrix</p>
              <p className="text-[15px] text-gray-400">
                Number of seats in each category
              </p>
            </div>
            <div className="w-full flex justify-end p-4">
              <ChairAltIcon fontSize="large" className="text-[#1B3058] " />
            </div>
          </div>
        </Link>

        <Link to="/rounds">
          <div className="w-[200px] h-[200px]  rounded-xl flex flex-col shadow-md hover:shadow-lg">
            <div className="w-full h-[80%] flex justify-center items-start p-4 text-[#1B3058]  flex-col">
              <p className="text-[30px]">Rounds</p>
              <p className="text-[15px] text-gray-400">
                You can find your round details here
              </p>
            </div>
            <div className="w-full flex justify-end p-4">
              <WifiProtectedSetupSharpIcon
                fontSize="large"
                className="text-[#1B3058] "
              />
            </div>
          </div>
        </Link>
        <Link to="/search">
          <div className="w-[200px] h-[200px]  rounded-xl flex flex-col shadow-md hover:shadow-lg">
            <div className="w-full h-[80%] flex justify-center items-start p-4 text-[#1B3058]  flex-col">
              <p className="text-[30px]">Search</p>
              <p className="text-[15px] text-gray-400">
                You can find and update candidate statuses
              </p>
            </div>
            <div className="w-full flex justify-end p-4">
              <SearchIcon fontSize="large" className="text-[#1B3058] " />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;

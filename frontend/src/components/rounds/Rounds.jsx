import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import RoundDetails from "./RoundDetails";
import { serverLink } from "../../serverLink";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

function Rounds(props) {
  const navigate = useNavigate();

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const [rounds, SetRounds] = useState([]);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
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
          // console.log(res.data.rounds);
          let r = [];
          for (let i = 1; i <= res.data.rounds; i++) {
            r.push(`Round-${i}`);
          }
          SetRounds(r);
          setSelectedRoundIndex(r.length - 1);
          setIsLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          if (err.response && err.response.status === 401) {
            navigate("/");
          }
        });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleReset = () => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .get(
          `${process.env.REACT_APP_BACKEND_URL}/api/rounds/reset/${
            selectedRoundIndex + 1
          }`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )

        .then((res) => {
          // console.log(res.data.result);
          window.location.reload();
          setIsLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[800px] h-auto flex justify-center items-center">
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="w-full flex flex-col items-stretch justify-center mt-8 h-auto">
          {/* <div className="w-full flex justify-center">
                    <p className='text-3xl text-gray-400'>Rounds Status</p>
    </div>*/}
          <div className="w-full flex  mt-2 justify-center rounded-md">
            <div className="flex flex-col justify-start items-stretch  w-[20%] min-h-[80vh]  shadow-md rounded-md">
              <div className="flex justify-center w-full self-auto border-[1px] p-6 bg-[#1B3058] h-[80px] rounded-md">
                <p className="text-2xl text-yellow-400 ">Rounds</p>
              </div>
              {rounds.map((roundName, index) => {
                return (
                  <div
                    className="flex justify-center w-full self-auto border-[1px] p-6 cursor-pointer"
                    style={{
                      background:
                        index === selectedRoundIndex ? "#f3f4f6" : "white",
                    }}
                    onClick={() => setSelectedRoundIndex(index)}
                  >
                    <p className="text-2xl text-gray-400">{roundName}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col justify-start items-center w-[70%] min-h-max shadow-md border-radius rounded-md">
              <div className="w-full flex  bg-[#1B3058] h-[80px]  items-center justify-center gap-10">
                <p className="text-3xl text-yellow-400 ">
                  Round-{selectedRoundIndex + 1} Details
                </p>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  style={{ color: "white", background: "red" }}
                >
                  Reset
                </Button>
              </div>
              {rounds.map((roundName, index) => {
                // console.log(index);
                if (index === selectedRoundIndex) {
                  return <RoundDetails roundNumber={index + 1} />;
                } else {
                  return <div></div>;
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rounds;

import { Autocomplete, Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import axios from "axios";

import { serverLink } from "../../serverLink";
import Search from "@mui/icons-material/Search";
import FilteredCandidatesTable from "./FilteredCandidatesTable";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FilterOptions(props) {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const navigate = useNavigate();
  const genderLabels = [{ label: "Male" }, { label: "Female" }];
  const CategoryLabels = [
    { label: "GEN" },
    { label: "OBC" },
    { label: "SC" },
    { label: "ST" },
  ];
  const [data, setData] = React.useState([]);
  const [coapId, setcoapId] = React.useState(null);
  const [gender, setGender] = React.useState(null);
  const [category, setCategory] = React.useState(null);
  const [coapIds, setCoapIds] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/search/getCoapIds`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
          withCredentials: true,
        })
        .then((res) => {
          setCoapIds(res.data.result);
          // console.log(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          if (err.response && err.response.status === 401) {
            navigate("/");
          } else {
            toast.error(err.message, {
              position: "top-center",
              autoClose: true, // Do not auto-close
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
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

  const getData = () => {
    setIsLoading(true);
    try {
      const jwtToken = getCookie("jwtToken");
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/search/getinfo`,
          { category: category, gender: gender, coapId: coapId },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          setData(res.data.result);
          // console.log(res.data.result);
          setIsLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          toast.error(err.message, {
            position: "top-center",
            autoClose: true, // Do not auto-close
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full justify-start items-center  h-fit">
      <ToastContainer />
      <div className="w-full flex justify-center">
        <p className="text-3xl text-gray-400">Search</p>
      </div>
      <div className="flex justify-between align-center w-[90%] h-fit border-[1px] box-border p-1 bg-zinc-100">
        <div>
          <Autocomplete
            value={coapId}
            onChange={(event, newValue) => {
              setcoapId(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={coapIds}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="COAP ID" />}
          />
        </div>
        <div>
          <Autocomplete
            value={category}
            onChange={(event, newValue) => {
              setCategory(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={CategoryLabels}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
        </div>
        <div>
          <Autocomplete
            value={gender}
            onChange={(event, newValue) => {
              setGender(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={genderLabels}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Gender" />}
          />
        </div>
        <div className="flex items-center">
          <Button variant="contained" endIcon={<Search />} onClick={getData}>
            Search
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <p className="text-3xl text-gray-400">Filtered Results</p>
      </div>
      <FilteredCandidatesTable data={data} />
    </div>
  );
}

export default FilterOptions;

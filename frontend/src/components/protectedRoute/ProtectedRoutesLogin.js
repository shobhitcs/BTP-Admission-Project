import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import { Fab } from "@material-ui/core";

const ProtectedRoutesLogin = () => {
  const [auth, setAuth] = useState({ token: false });
  const [isAdmin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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
        // console.log("the response is: ", response.data);

        if (response.data.isAdmin) {
          setAdmin(true);
        } else {
          setAdmin(false);
        }
        setAuth({ token: true });
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // console.log("User is not authenticated. Navigating to '/'...");
          setAuth({ token: false });
          setAdmin(false);
          setLoading(false);
        } else {
          console.error("Error checking authentication:", error);
          setAdmin(false);
          setLoading(false);
        }
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography variant="body1" style={{ marginLeft: "10px" }}>
          Loading...
        </Typography>
      </div>
    );
  }

  return !auth.token ? (
    <Outlet />
  ) : isAdmin ? (
    <Navigate to="/admin" />
  ) : (
    <Navigate to="/home" />
  );
};

export default ProtectedRoutesLogin;

import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Box,
} from "@mui/material";
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
  // Helper function to get cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [branches, setBranches] = useState([]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

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
        navigate("/home");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          console.error("Error checking authentication:", error);
        }
      }
    };
    checkAuthentication();

    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/branch/branches`
        );

        const filteredData = response.data.filter((item) => item !== "admin");
        setBranches(filteredData);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const loginResponse = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          username: trimmedUsername,
          password,
          branch: isAdmin ? "admin" : branch,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (loginResponse.status !== 200) {
        throw new Error("Invalid credentials");
      }

      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Invalid username or password.");
    }
  };

  return (
    <div style={{ padding: '10px', backgroundColor: '#ebf2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 350,
          width: "100%",
          fontFamily: 'Maven Pro, sans-serif',
        }}
      >
        <LockOutlinedIcon color="primary" fontSize="large" />
        <Typography component="h1" variant="h5" sx={{ fontFamily: 'Righteous, cursive', marginTop: 1 }}>
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ fontFamily: 'Barlow, sans-serif', marginTop: 1 }}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          noValidate
          sx={{
            width: "100%",
            marginTop: 1,
            fontFamily: 'Ubuntu, sans-serif'
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ fontFamily: 'Poppins, sans-serif', marginBottom: 1, }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ fontFamily: 'Poppins, sans-serif', marginBottom: 1 }}
          />
          <FormControl variant="outlined" margin="normal" fullWidth sx={{ marginBottom: 1 }}>
            <InputLabel>Branch</InputLabel>
            <Select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              label="Branch"
              disabled={isAdmin}
              sx={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {branches.map((branch) => (
                <MenuItem key={branch} value={branch} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                color="primary"
              />
            }
            label="Are you an admin?"
            sx={{ fontFamily: 'Barlow, sans-serif', marginBottom: 2 }}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              fontFamily: 'Ubuntu, sans-serif'
            }}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </div>
  );
}

export default LoginForm;

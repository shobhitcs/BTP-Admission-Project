import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, TextField, Button, IconButton, InputAdornment, MenuItem, FormControl, Select, InputLabel, Checkbox, FormControlLabel, Box } from "@mui/material";
import { LockOutlined as LockOutlinedIcon, Visibility, VisibilityOff} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginForm() {
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
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LockOutlinedIcon color="primary" fontSize="large" />
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <Box
          component="form"
          noValidate
          sx={{
            width: "100%",
            marginTop: 1,
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          />
          <FormControl variant="outlined" margin="normal" fullWidth>
            <InputLabel>Branch</InputLabel>
            <Select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              label="Branch"
              disabled={isAdmin}
            >
              {branches.map((branch) => (
                <MenuItem key={branch} value={branch}>
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
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              marginTop: 3,
              marginBottom: 2,
            }}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginForm;

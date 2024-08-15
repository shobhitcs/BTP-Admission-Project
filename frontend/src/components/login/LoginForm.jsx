import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  makeStyles,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function LoginForm() {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const classes = useStyles();
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
        // console.log("the response is: ", response.data);
        navigate("/home");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // console.log("User is not authenticated. Navigating to '/'...");
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
    // Trim the username before submitting
    const trimmedUsername = username.trim();

    // Validate inputs
    if (!trimmedUsername || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Make API call to login
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

      // Handle successful login
      // console.log("Login successful. JWT token:", loginResponse.data.token);
      // Redirect to home page
      navigate("/home");
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error.message);
      setError("Invalid username or password.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} className={classes.paper}>
        <LockOutlinedIcon color="primary" fontSize="large" />
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
        <form className={classes.form} noValidate>
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
              disabled={isAdmin} // Disable the Branch field if isAdmin is true
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
            className={classes.submit}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default LoginForm;

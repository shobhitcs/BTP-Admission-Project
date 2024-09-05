import React, { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  Snackbar,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminPanel() {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("");
  const [error, setError] = useState("");
  const [duplicateEntryError, setDuplicateEntryError] = useState(null);
  const [branchExistsError, setBranchExistsError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openCreateSnackbar, setOpenCreateSnackbar] = useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
  const [openDeleteUserSnackbar, setOpenDeleteUserSnackbar] = useState(false);
  const [openUpdateSnackbar, setOpenUpdateSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [openAddBranchSnackbar, setOpenAddBranchSnackbar] = useState(false);
  const [newPasswordMap, setNewPasswordMap] = useState({});
  const [branchFilter, setBranchFilter] = useState("All");
  const [programs, setPrograms] = useState([]);
  const [newProgram, setNewProgram] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users on component mount
    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/users`)
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
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
        if (!response.data.isAdmin) {
          // alert("You need to be an admin to access admin console");
          navigate("/home");
        }
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
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/branch/branches`
      );
      const filteredData = response.data.filter((item) => item !== "admin");
      setPrograms(filteredData);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/users`
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (branchFilter === "All" || user.branch === branchFilter)
  );

  const handleDeleteUser = (userId) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setUsers(users.filter((user) => user.id !== userId));
          setOpenDeleteUserSnackbar(true);
        } else {
          return response.json().then((data) => {
            console.error("Error deleting user:", data.error);
          });
        }
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = () => {
    if (!username.trim() || !password || !branch) {
      // Trim the username before checking if it's empty
      setError("Please fill in all fields.");
      return;
    }

    if (username.toLowerCase().trim() === "admin") {
      // Trim the username before comparing
      setError("You can't add a user with the username 'admin'.");
      return;
    }

    const trimmedUsername = username.trim(); // Trim the username

    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: trimmedUsername, // Use trimmed username
        password,
        branch,
      }),
    })
      .then((response) => {
        if (response.ok) {
          setUsername("");
          setPassword("");
          setBranch("");
          setError("");
          fetchUsers();
          setOpenCreateSnackbar(true);
          setDuplicateEntryError(null); // Clear duplicate entry error
          setBranchExistsError(null); // Clear branch exists error
        } else {
          return response.json().then((data) => {
            setDuplicateEntryError(data.error || "Failed to register user.");
            setBranchExistsError(null);
          });
        }
      })
      .catch((error) => {
        setError("Failed to register user. Please try again later.");
        console.error("Error registering user:", error);
      });
  };

  const handleNewPasswordChange = (userId, newPassword) => {
    setNewPasswordMap((prevMap) => ({
      ...prevMap,
      [userId]: newPassword,
    }));
  };

  const handleUpdatePassword = (userId) => {
    const newPassword = newPasswordMap[userId];

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/admin/users/${userId}/password`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          setNewPasswordMap((prevMap) => ({
            ...prevMap,
            [userId]: "",
          }));
          setOpenUpdateSnackbar(true);
        } else {
          return response.json().then((data) => {
            setError(data.error || "Failed to update password.");
          });
        }
      })
      .catch((error) => {
        setError("Failed to update password. Please try again later.");
        console.error("Error updating password:", error);
      });
  };

  const handleBranchFilterChange = (event) => {
    setBranchFilter(event.target.value);
  };

  const handleAddBranch = () => {
    if (!newProgram) {
      setError("Please enter a new branch.");
      return;
    }

    const trimmedBranch = newProgram.trim().toUpperCase(); // Convert to uppercase and trim
    setNewProgram(trimmedBranch); // Update the input field with the trimmed and uppercase branch

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/branch/addBranch`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newBranch: trimmedBranch, // Pass the trimmed and uppercase branch to the backend
      }),
    })
      .then((response) => {
        // console.log("response for adding the branch: ", response);
        if (response.ok) {
          setPrograms([...programs, trimmedBranch]); // Update the programs state with the new uppercase branch
          setBranch(trimmedBranch); // Set the new branch in the select dropdown
          setNewProgram(""); // Clear the input field
          setError(""); // Clear any previous errors
          setDuplicateEntryError(null); // Clear duplicate entry error
          setBranchExistsError(null); // Clear branch exists error
          setOpenAddBranchSnackbar(true);
        } else {
          return response.json().then((data) => {
            setBranchExistsError(data.error || "Failed to add new branch.");
            setDuplicateEntryError(null);
          });
        }
      })
      .catch((error) => {
        setError("Failed to add new branch. Please try again later.");
      });
  };

  const [selectedBranch, setSelectedBranch] = useState("");

  const handleDeleteBranch = (branchName) => {
    const isConfirmed = branchName !== ""

    if (isConfirmed) {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/admin/deleteBranch/${branchName}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => {
          if (response.ok) {
            setPrograms(programs.filter((program) => program !== branchName));
            setUsers(users.filter((user) => user.branch !== branchName));
            setOpenDeleteSnackbar(true)
          } else {
            return response.json().then((data) => {
              setError(data.error || "Failed to delete branch.");
              setOpenErrorSnackbar(true);
            });
          }
        })
        .catch((error) => {
          setError("Failed to delete branch. Please try again later.");
          setOpenErrorSnackbar(true);
        });
    }
  };

  return (
    <Container maxWidth="200px" className="pt-10" sx={{ padding: '100px 10px 30px 10px', display: 'flex', justifyContent: 'center' }}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        style={{ height: "100%", maxWidth: '1100px', margin: '0 auto' }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h5"
            gutterBottom
            align="center"
            sx={{ fontFamily: 'Ubuntu, sans-serif', fontWeight: 600, mb: '20px' }}
          >
            Admin Panel
          </Typography>
        </Grid>

        {/* Responsive layout for Add User and Manage Branches sections */}
        <Grid
          container
          spacing={2}
          sx={{ mb: '50px', display: 'flex', justifyContent: 'space-between' }}
        >
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                maxWidth: 500,
                margin: { xs: '0 auto 20px', md: '0 auto 0 0' },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                align="center"
                sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}
              >
                Add User
              </Typography>

              {duplicateEntryError && (
                <Typography
                  variant="body2"
                  color="error"
                  align="center"
                  sx={{ mb: 2 }}
                >
                  {duplicateEntryError}
                </Typography>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    color="secondary"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ marginBottom: 2 }}
                  />
                  <Snackbar
                    open={error === "You can't add a user with the username 'admin'."}
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                    message="You can't add admin"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    color="secondary"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ marginBottom: 2 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel color="secondary">Branch</InputLabel>
                    <Select
                      fullWidth
                      label="Branch"
                      color="secondary"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      {programs.map((program) => (
                        <MenuItem key={program} value={program}>
                          {program}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={handleSubmit}
                    fullWidth
                    style={{ padding: '10px 0', background: '#7A1CAC' }}
                  >
                    Add User
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                padding: 3,
                marginTop: { xs: 3, md: 0 },
                maxWidth: 500,
                margin: { xs: '0 auto', md: '0 0 0 auto' },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                align="center"
                sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}
              >
                Manage Branches
              </Typography>

              {branchExistsError && (
                <Typography
                  variant="body2"
                  color="error"
                  align="center"
                  sx={{ mb: 2 }}
                >
                  {branchExistsError}
                </Typography>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    color="secondary"
                    label="New Branch"
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddBranch}
                    startIcon={<AssuredWorkloadIcon />}
                    fullWidth
                    style={{ padding: '10px 0', background: '#7A1CAC' }}
                  >
                    Add Branch
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel color="secondary">Delete Branch</InputLabel>
                    <Select
                      value={selectedBranch}
                      label="Delete Branch"
                      color="secondary"
                      onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                      {programs.map((program) => (
                        <MenuItem key={program} value={program}>
                          {program}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDeleteBranch(selectedBranch)}
                    startIcon={<DeleteForeverIcon />}
                    fullWidth
                    style={{ padding: '10px 0', background: '#7A1CAC' }}
                  >
                    Remove Branch
                  </Button>
                </Grid>
              </Grid>

            </Paper>
          </Grid>
        </Grid>


        {/* User View Section */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={3}
            sx={{
              padding: '20px 10px 50px 10px',
              margin: '0px',
              width: '100%',
            }}
          >
            <Typography variant="h6" gutterBottom align="center" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', marginBottom: 2 }}>
              Added Users
            </Typography>

            <Grid container
              alignItems="center"
              justifyContent="center" sx={{ padding: '0 10px 0 10px' }}>
              {/* Search Field */}
              <Grid xs={12} md={8} >
                <TextField
                  variant="outlined"
                  placeholder="Search By Username"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearchTermChange}
                  sx={{
                    backgroundColor: 'white',
                    marginBottom: { xs: '10px', md: 0 }, // Adds margin on mobile only
                    maxWidth: '400px',
                    borderRadius: 2,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Branch Filter */}
              <Grid xs={12} md={4} >
                <FormControl variant="outlined" fullWidth>
                  <Select
                    value={branchFilter}
                    onChange={handleBranchFilterChange}
                    displayEmpty
                    sx={{
                      maxWidth: '400px',
                      borderRadius: 2,
                      backgroundColor: 'white',
                    }}
                  >
                    <MenuItem value="All">All Branches</MenuItem>
                    {programs.map((program) => (
                      <MenuItem key={program} value={program}>
                        {program}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>




            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontFamily: 'Arial, sans serif', fontWeight: 600 }}>Username</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'Arial, sans serif', fontWeight: 600 }}>Branch</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'Arial, sans serif', fontWeight: 600 }}>Delete</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'Arial, sans serif', fontWeight: 600 }}>New Password</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'Arial, sans serif', fontWeight: 600 }}>Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody  >
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} sx={{ fontFamily: 'Poppins, sans serif' }}>
                      <TableCell sx={{ fontFamily: 'Poppins, sans serif' }}>{user.username}</TableCell>
                      <TableCell align="center" sx={{ fontFamily: 'Poppins, sans serif' }}>{user.branch}</TableCell>
                      <TableCell align="center" >
                        <IconButton
                          onClick={() => handleDeleteUser(user.id)}
                          color="secondary"
                          disabled={user.isAdmin}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="password"
                          value={newPasswordMap[user.id] || ""}
                          onChange={(e) => handleNewPasswordChange(user.id, e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ fontFamily: 'Poppins, sans serif', minWidth: '200px' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpdatePassword(user.id)}
                          size="small"
                          style={{ backgroundColor: '#7A1CAC', fontFamily: 'Poppins, sans serif' }}
                        >
                          SAVE
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>


      </Grid>
      <Snackbar
        open={openCreateSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenCreateSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenCreateSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          User created successfully!
        </Alert>
      </Snackbar>


      <Snackbar
        open={openAddBranchSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenAddBranchSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenAddBranchSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Branch added successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openUpdateSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenUpdateSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenUpdateSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Password updated successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenDeleteSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenDeleteSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Branch deleted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openDeleteUserSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenDeleteUserSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenDeleteUserSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          User deleted successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={openErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenErrorSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenErrorSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          Unexpected Error!
        </Alert>
      </Snackbar>
    </Container>

  );
}

export default AdminPanel;

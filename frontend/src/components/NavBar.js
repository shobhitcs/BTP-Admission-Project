import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import {
  ExitToApp as ExitToAppIcon,
  // Person as PersonIcon,
  // AccountBalance as AccountBalanceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import axios from "axios";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [auth, setAuth] = useState({ token: false });
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          setAuth({
            token: true,
            username: response.data.username,
            branch: response.data.branch,
            isAdmin: response.data.isAdmin,
          });
        } else {
          setAuth({ token: false });
        }
      } catch (error) {
        console.error("Error checking authentication");
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
      if (response.status === 200) {
        localStorage.removeItem("jwtToken");
        navigate("/");
      } else {
        console.error("Signout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerItems = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem>
          <NavLink to="/home" style={({ isActive }) => ({ color: isActive ? "blue" : "black", textDecoration: 'none' })}>
            <span>Home</span>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/initialise" style={({ isActive }) => ({ color: isActive ? "blue" : "black", textDecoration: 'none' })}>
            <span>Initialisation</span>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/seatMatrix" style={({ isActive }) => ({ color: isActive ? "blue" : "black", textDecoration: 'none' })}>
            <span>Seat Matrix</span>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/rounds" style={({ isActive }) => ({ color: isActive ? "blue" : "black", textDecoration: 'none' })}>
            <span>Rounds</span>
          </NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/search" style={({ isActive }) => ({ color: isActive ? "blue" : "black", textDecoration: 'none' })}>
            <span>Search</span>
          </NavLink>
        </ListItem>
        <ListItem onClick={handleSignOut}>
          <span>Logout</span>
        </ListItem>
      </List>
    </div>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#303030", fontFamily: 'Ubuntu, sans serif' }}>
      <Toolbar>
        {auth.token && (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <PersonIcon style={{ fontSize: 24, color: "white" }} /> */}
            Hi, 
            <span style={{ color: "white", marginLeft: "8px" }}>
              {auth.username}
            </span>

            {!auth.isAdmin && (
              <>
                {/* <AccountBalanceIcon
                  style={{ fontSize: 24, color: "white", marginLeft: "10px" }}
                /> */}
                   
                <span style={{ color: "white", marginLeft: "8px" }}>
                Dept. {auth.branch}
                </span>
              </>
            )}
          </div>
        )}
        {!auth.token && (
          <div style={{ display: "flex", alignItems: "center" }}>
            M. Tech Admission Portal
          </div>
        )}

        <div style={{ flexGrow: 1 }} />

        {isMobile ? (
          <>
            <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
              {drawerItems}
            </Drawer>
          </>
        ) : (
          <div style={{ display: "flex", alignItems: "center", fontFamily : 'Monda, sans serif' }}>
            {auth.token ? (
              <>
                {!auth.isAdmin && (
                  <>
                    <NavLink to="/home" style={({ isActive }) => ({
                      color: isActive ? "#4CCD99" : "white",
                      textDecoration: 'none',
                      margin: '0 10px'
                    })}>
                      <span>Home</span>
                    </NavLink>
                    <NavLink to="/initialise" style={({ isActive }) => ({
                      color: isActive ? "#4CCD99" : "white",
                      textDecoration: 'none',
                      margin: '0 10px'
                    })}>
                      <span>Initialisation</span>
                    </NavLink>
                    <NavLink to="/seatMatrix" style={({ isActive }) => ({
                      color: isActive ? "#4CCD99" : "white",
                      textDecoration: 'none',
                      margin: '0 10px'
                    })}>
                      <span>Seat Matrix</span>
                    </NavLink>
                    <NavLink to="/rounds" style={({ isActive }) => ({
                      color: isActive ? "#4CCD99" : "white",
                      textDecoration: 'none',
                      margin: '0 10px'
                    })}>
                      <span>Rounds</span>
                    </NavLink>
                    <NavLink to="/search" style={({ isActive }) => ({
                      color: isActive ? "#4CCD99" : "white",
                      textDecoration: 'none',
                      margin: '0 10px'
                    })}>
                      <span>Search</span>
                    </NavLink>
                  </>
                )}
                <Tooltip title="Logout">
                  <IconButton color="inherit" onClick={handleSignOut}>
                    <ExitToAppIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <></>
            )
            }
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;

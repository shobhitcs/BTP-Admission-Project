import React from "react";
import { Box } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 60,
        backgroundColor: "#303030",
        marginTop: "auto",
        padding: "20px"
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: "500",
          color: "#bfbfbf",
          textAlign: "center",
        }}
      >
        Built under the supervision of{" "}
        <b style={{ color: "white" }}>Dr. Divya Padmanabhan, Dr. Satyanath Bhat</b>
      </p>
    </Box>
  );
}

export default Footer;

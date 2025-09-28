import React from "react";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          borderRadius: 2,
        }}
      >
        <CircularProgress size={60} />

        <Typography variant="h6" component="div" color="text.secondary">
          Připojování k serveru...
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoadingScreen;

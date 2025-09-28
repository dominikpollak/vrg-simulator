import { useEffect, useRef } from "react";
import { Paper, Box } from "@mui/material";
import { useSimulationStore } from "../../store/simulationStore";

const DataLogPanel = () => {
  const { logMessages } = useSimulationStore();

  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logMessages]);

  return (
    <Paper
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          fontSize: "0.8rem",
          fontFamily: "monospace",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        {logMessages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
        <div ref={endOfLogRef} />
      </Box>
    </Paper>
  );
};

export default DataLogPanel;

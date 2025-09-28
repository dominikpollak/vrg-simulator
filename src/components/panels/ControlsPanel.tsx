import { Button, ButtonGroup, Paper, Box, Divider } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import StopIcon from "@mui/icons-material/Stop";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useSimulationStore } from "../../store/simulationStore";
import { sendCommand } from "../../services/websocketService";
import { Straighten } from "@mui/icons-material";
import { useMeasureDialogStore } from "../../store/measureDialogStore";

const ControlsPanel = () => {
  const { selectedEntityId, entities, selectEntity } = useSimulationStore();
  const { setIsMeasureDialogOpen } = useMeasureDialogStore();

  const selectedEntity = selectedEntityId ? entities[selectedEntityId] : null;
  const hasRoute = !!(selectedEntity?.route && selectedEntity.route.length > 0);

  const { simulationStatus } = useSimulationStore();

  const handleCommand = (command: string) => {
    sendCommand({ type: "control", command });
  };

  const handleAddUnit = () => {
    sendCommand({ type: "addUnit" });
  };

  const handleDeleteUnit = () => {
    if (selectedEntityId) {
      sendCommand({
        type: "deleteUnit",
        payload: { entityId: selectedEntityId },
      });
      selectEntity(null);
    }
  };

  // Nová funkce pro smazání trasy
  const handleClearRoute = () => {
    if (selectedEntityId) {
      sendCommand({
        type: "clearRoute",
        payload: { entityId: selectedEntityId },
      });
    }
  };

  return (
    <Paper elevation={0} style={{ padding: 16 }}>
      <ButtonGroup variant="contained" fullWidth>
        <Button
          onClick={() => handleCommand("play")}
          disabled={simulationStatus === "play"}
        >
          <PlayArrowIcon />
        </Button>
        <Button
          onClick={() => handleCommand("pause")}
          disabled={simulationStatus !== "play"}
        >
          <PauseIcon />
        </Button>
        <Button onClick={() => handleCommand("step")}>
          <SkipNextIcon />
        </Button>
        <Button
          onClick={() => handleCommand("stop")}
          disabled={simulationStatus === "stop" || simulationStatus === "pause"}
        >
          <StopIcon />
        </Button>
      </ButtonGroup>
      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddUnit}
        >
          Přidat jednotku
        </Button>
        <Button
          variant="outlined"
          color="success"
          startIcon={<Straighten />}
          onClick={() => setIsMeasureDialogOpen(true)}
        >
          Změřit vzdálenost
        </Button>

        <Divider sx={{ my: 1 }} />

        <Button
          variant="outlined"
          color="warning"
          startIcon={<ClearAllIcon />}
          onClick={handleClearRoute}
          disabled={!selectedEntityId || !hasRoute}
        >
          Smazat trasu
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteUnit}
          disabled={!selectedEntityId}
        >
          Smazat jednotku
        </Button>
      </Box>
    </Paper>
  );
};

export default ControlsPanel;

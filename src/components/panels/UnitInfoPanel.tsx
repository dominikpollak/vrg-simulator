import { Paper, Typography } from "@mui/material";
import { useSimulationStore } from "../../store/simulationStore";

const UnitInfoPanel = () => {
  const { entities, selectedEntityId } = useSimulationStore();
  const entity = selectedEntityId ? entities[selectedEntityId] : null;

  if (!entity) {
    return (
      <Paper elevation={0} style={{ padding: 16 }}>
        <Typography>Žádná vybraná jednotka</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} style={{ padding: 16 }}>
      <Typography variant="h6">{entity.callsign}</Typography>
      <Typography>
        <span style={{ color: "aqua" }}>Typ:</span> {entity.type}
      </Typography>
      <Typography>
        <span style={{ color: "aqua" }}>Pozice:</span>{" "}
        {entity.position.join(", ")}
      </Typography>
      <Typography>
        <span style={{ color: "aqua" }}>Úkol:</span> {entity.task}
      </Typography>
      <Typography>
        <span style={{ color: "aqua" }}>Rychlost:</span> {entity.speed} km/h
      </Typography>
      <Typography>
        <span style={{ color: "aqua" }}>Poškození:</span> {entity.damage}%
      </Typography>
      <Typography>
        <span style={{ color: "aqua" }}>Munice:</span> {entity.ammo}%
      </Typography>
    </Paper>
  );
};

export default UnitInfoPanel;

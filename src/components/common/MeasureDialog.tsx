import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useSimulationStore } from "../../store/simulationStore";
import { getDistance } from "ol/sphere";

interface MeasureDialogProps {
  open: boolean;
  onClose: () => void;
}

const MeasureDialog = ({ open, onClose }: MeasureDialogProps) => {
  const { entities } = useSimulationStore();
  const [unitAId, setUnitAId] = useState("");
  const [unitBId, setUnitBId] = useState("");

  const entitiesArray = useMemo(() => Object.values(entities), [entities]);

  const handleCloseDialog = () => {
    setUnitAId("");
    setUnitBId("");
    onClose();
  };

  const distance = useMemo(() => {
    if (unitAId && unitBId && unitAId !== unitBId) {
      const entityA = entities[unitAId];
      const entityB = entities[unitBId];
      if (entityA && entityB) {
        const meters = getDistance(entityA.position, entityB.position);
        return (meters / 1000).toFixed(2); // km
      }
    }
    return null;
  }, [unitAId, unitBId, entities]);

  return (
    <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="xs">
      <DialogTitle>Měření vzdálenosti</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Jednotka A</InputLabel>
            <Select
              value={unitAId}
              label="Jednotka A"
              onChange={(e: SelectChangeEvent) => setUnitAId(e.target.value)}
            >
              {entitiesArray.map((entity) => (
                <MenuItem key={entity.id} value={entity.id}>
                  {entity.callsign} ({entity.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Jednotka B</InputLabel>
            <Select
              value={unitBId}
              label="Jednotka B"
              onChange={(e: SelectChangeEvent) => setUnitBId(e.target.value)}
            >
              {entitiesArray.map((entity) => (
                <MenuItem key={entity.id} value={entity.id}>
                  {entity.callsign} ({entity.type})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {distance !== null && (
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              Vzdušná vzdálenost: <b>{distance} km</b>
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Zavřít</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MeasureDialog;

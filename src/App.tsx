import { useEffect, useState } from "react";
import { useSimulationStore, type Entity } from "./store/simulationStore";
import {
  closeWebSocket,
  initializeWebSocket,
} from "./services/websocketService";
import LoadingScreen from "./components/common/LoadingScreen";
import MainLayout from "./components/layout/MainLayout";
import MeasureDialog from "./components/common/MeasureDialog";
import { useMeasureDialogStore } from "./store/measureDialogStore";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { isMeasureDialogOpen, setIsMeasureDialogOpen } =
    useMeasureDialogStore();

  const {
    setInitialEntities,
    updateEntity,
    removeEntity,
    setSimulationStatus,
    addLogMessage,
    addEntity,
  } = useSimulationStore();

  useEffect(() => {
    const handleOpen = () => {
      setIsConnected(true);
      addLogMessage("Spojení s backendem navázáno.");
    };

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "init":
          setInitialEntities(data.payload.entities);
          setSimulationStatus(data.payload.status);
          addLogMessage("Iniciální data načtena.");
          break;
        case "create":
          addEntity(data.payload);
          addLogMessage(`Vytvořena nová jednotka: ${data.payload.callsign}`);
          break;
        case "update":
          data.payload.forEach((entityUpdate: Entity) => {
            updateEntity(entityUpdate);
            if (!entityUpdate.route.length) {
              addLogMessage(`Trasa jednotky ${entityUpdate.callsign} smazána.`);
              return;
            }
            addLogMessage(`Trasa jednotky ${entityUpdate.callsign} změněna.`);
          });
          break;
        case "destroy":
          removeEntity(data.payload.id);
          addLogMessage(`Jednotka ${data.payload.id} zničena.`);
          break;
        case "control":
          addLogMessage(`Příkaz odeslán: ${data.payload.status}`);
          setSimulationStatus(data.payload.status);
          break;
      }
    };

    const handleClose = () => {
      setIsConnected(false);
      addLogMessage("Spojení s backendem ztraceno.");
    };

    initializeWebSocket({
      onOpen: handleOpen,
      onMessage: handleMessage,
      onClose: handleClose,
    });

    return () => {
      closeWebSocket();
    };
  }, [
    setInitialEntities,
    updateEntity,
    removeEntity,
    addEntity,
    setSimulationStatus,
    addLogMessage,
  ]);

  if (!isConnected) {
    return <LoadingScreen />;
  }

  return (
    <>
      <MainLayout />
      <MeasureDialog
        open={isMeasureDialogOpen}
        onClose={() => setIsMeasureDialogOpen(false)}
      />
    </>
  );
};

export default App;

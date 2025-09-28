import { create } from "zustand";

export interface Entity {
  id: string;
  type: "Tank" | "Infantry" | "Helicopter";
  callsign: string;
  position: [number, number];
  route: [number, number][];
  speed: number;
  damage: number;
  ammo: number;
  task: string;
}

interface SimulationState {
  entities: Record<string, Entity>;
  selectedEntityId: string | null;
  simulationStatus: "stop" | "play" | "pause";
  logMessages: string[];
  // actions
  setInitialEntities: (entities: Entity[]) => void;
  updateEntity: (entity: Partial<Entity> & { id: string }) => void;
  removeEntity: (entityId: string) => void;
  addEntity: (entity: Entity) => void;
  selectEntity: (entityId: string | null) => void;
  setSimulationStatus: (status: SimulationState["simulationStatus"]) => void;
  addLogMessage: (message: string) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  entities: {},
  selectedEntityId: null,
  simulationStatus: "stop",
  logMessages: [],
  setInitialEntities: (entities) =>
    set({
      entities: entities.reduce((acc, entity) => {
        acc[entity.id] = entity;
        return acc;
      }, {} as Record<string, Entity>),
    }),
  updateEntity: (entityUpdate) =>
    set((state) => ({
      entities: {
        ...state.entities,
        [entityUpdate.id]: {
          ...state.entities[entityUpdate.id],
          ...entityUpdate,
        },
      },
    })),
  removeEntity: (entityId) =>
    set((state) => {
      const newEntities = { ...state.entities };
      delete newEntities[entityId];
      return {
        entities: newEntities,
        selectedEntityId:
          state.selectedEntityId === entityId ? null : state.selectedEntityId,
      };
    }),
  addEntity: (entity) =>
    set((state) => ({
      entities: {
        ...state.entities,
        [entity.id]: entity,
      },
    })),
  selectEntity: (entityId) => set({ selectedEntityId: entityId }),
  setSimulationStatus: (status) => set({ simulationStatus: status }),
  addLogMessage: (message) =>
    set((state) => ({
      logMessages: [
        ...state.logMessages,
        `${new Date().toLocaleTimeString()}: ${message}`,
      ],
    })),
}));

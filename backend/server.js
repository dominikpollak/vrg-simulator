import { WebSocketServer, WebSocket } from "ws";
import { v4 as uuidv4 } from "uuid";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server is running on ws://localhost:8080");

let simulationStatus = "stop";
let entities = {};

const unitPrototypes = [
  { type: "Artillery", callsign: "Gamma", task: "Kavalérie" },
  { type: "Infantry", callsign: "Theta", task: "Průzkum v terénu" },
  { type: "InfantrySniper", callsign: "Omega", task: "Eliminace cílů" },
  { type: "MotorisedInfantry", callsign: "Delta", task: "Rychlý přesun" },
  { type: "LightInfantry", callsign: "Beta", task: "Lehký průzkum" },
  { type: "Sniper", callsign: "Sigma", task: "Odstřelovač" },
];

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const createNewUnit = () => {
  const proto =
    unitPrototypes[Math.floor(Math.random() * unitPrototypes.length)];
  const id = uuidv4();
  const position = [14.2 + Math.random() * 0.6, 49.9 + Math.random() * 0.3];
  return {
    id,
    type: proto.type,
    callsign: `${proto.callsign} ${Math.floor(Math.random() * 100)}`,
    position: [...position],
    route: [],
    speed: 50,
    damage: 0,
    ammo: 100,
    task: proto.task,
  };
};

setInterval(() => {
  if (simulationStatus !== "play") return;

  const updates = [];
  const destroyedEntityIds = [];

  const allEntities = Object.values(entities);

  allEntities.forEach((entity) => {
    // Movement Logic
    if (entity.route.length > 0) {
      const target = entity.route[0];
      const dx = target[0] - entity.position[0];
      const dy = target[1] - entity.position[1];
      const distance = Math.sqrt(dx * dx + dy * dy);
      const step = 0.005;

      if (distance < step) {
        entity.position = [...target];
        entity.route.shift();
        updates.push({
          id: entity.id,
          position: entity.position,
          callsign: entity.callsign,
          route: entity.route,
        });
      } else {
        entity.position[0] += (dx / distance) * step;
        entity.position[1] += (dy / distance) * step;
        updates.push({
          id: entity.id,
          callsign: entity.callsign,
          position: entity.position,
        });
      }
    }
  });

  if (updates.length > 0) {
    broadcast({ type: "update", payload: updates });
  }

  if (destroyedEntityIds.length > 0) {
    destroyedEntityIds.forEach((id) => {
      console.log(`Unit ${entities[id].callsign} (${id}) has been destroyed.`);
      delete entities[id];
      broadcast({ type: "destroy", payload: { id } });
    });
  }
}, 1000);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(
    JSON.stringify({
      type: "init",
      payload: { entities: Object.values(entities), status: simulationStatus },
    })
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case "control": {
          const newStatus = data.command;
          simulationStatus = newStatus;
          console.log(`Simulation status changed to: ${simulationStatus}`);
          broadcast({
            type: "control",
            payload: { status: simulationStatus },
          });
          break;
        }

        case "addWaypoint": {
          const { entityId, point } = data.payload;
          const entity = entities[entityId];
          if (entity) {
            entity.route.push(point);
            console.log(`Added waypoint for ${entity.callsign}`);
            broadcast({
              type: "update",
              payload: [
                {
                  id: entityId,
                  callsign: entity.callsign,
                  route: entity.route,
                },
              ],
            });
          }
          break;
        }

        case "clearRoute": {
          const { entityId } = data.payload;
          const entity = entities[entityId];
          if (entity) {
            entity.route = [];
            console.log(`Cleared route for ${entity.callsign}`);
            broadcast({
              type: "update",
              payload: [{ id: entityId, route: entity.route }],
            });
          }
          break;
        }

        case "addUnit": {
          const newUnit = createNewUnit();
          entities[newUnit.id] = newUnit;
          console.log(`Created unit ${newUnit.callsign}`);
          broadcast({ type: "create", payload: newUnit });
          break;
        }

        case "deleteUnit": {
          const { entityId } = data.payload;
          if (entities[entityId]) {
            console.log(
              `Manually deleting unit ${entities[entityId].callsign}`
            );
            delete entities[entityId];
            broadcast({ type: "destroy", payload: { id: entityId } });
          }
          break;
        }

        default:
          console.warn(`Received unknown message type: ${data.type}`);
          break;
      }
    } catch (e) {
      console.error("Failed to process message:", e);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

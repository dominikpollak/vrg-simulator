const WS_URL = "ws://localhost:8080";
let websocket: WebSocket | null = null;

interface WebSocketHandlers {
  onOpen: () => void;
  onMessage: (event: MessageEvent) => void;
  onClose: () => void;
}

export const initializeWebSocket = (handlers: WebSocketHandlers) => {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    console.warn("WebSocket is already connected.");
    return;
  }

  websocket = new WebSocket(WS_URL);

  websocket.onopen = handlers.onOpen;
  websocket.onmessage = handlers.onMessage;
  websocket.onclose = handlers.onClose;
  websocket.onerror = (error) => {
    console.error("WebSocket Error:", error);
    handlers.onClose();
  };
};

export const sendCommand = (command: object) => {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(command));
  } else {
    console.error("WebSocket is not connected. Cannot send command.");
  }
};

export const closeWebSocket = () => {
  if (websocket) {
    websocket.close();
    websocket = null;
  }
};

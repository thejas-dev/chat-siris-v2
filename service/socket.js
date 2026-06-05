import { io } from "socket.io-client";
import { getAccessToken } from "../utils/authToken";

let socket = null;
let listenersAttached = false;

let pendingUserId = null;
let pendingChannelRef = null;

function realtimeBaseUrl() {
  const base =
    process.env.NEXT_PUBLIC_REALTIME_BASE ||
    process.env.NEXT_PUBLIC_SERVER_BASE ||
    "";
  return base.replace(/\/$/, "");
}

function applySocketAuth(client) {
  const token = getAccessToken();
  if (token) {
    client.auth = { token };
    client.io.opts.extraHeaders = {
      Authorization: `Bearer ${token}`,
      "my-custom-header": "abcd",
    };
  }
}

function attachSocketListeners(client) {
  if (listenersAttached) {
    return;
  }
  listenersAttached = true;

  client.on("connect", () => {
    console.info("[socket] connected", client.id);
    flushPendingEmits();
  });

  client.on("reconnect", () => {
    console.info("[socket] reconnected", client.id);
    applySocketAuth(client);
    flushPendingEmits();
  });

  client.on("disconnect", (reason) => {
    console.info("[socket] disconnected", reason);
  });

  client.on("connect_error", (err) => {
    console.error("[socket] connect_error", err.message);
  });
}

/** Lazy init — socket.io must not be created during Next.js SSR. */
export function getSocket() {
  if (typeof window === "undefined") {
    return null;
  }

  if (socket) {
    return socket;
  }

  const base = realtimeBaseUrl();
  if (!base) {
    console.error(
      "[socket] Set NEXT_PUBLIC_REALTIME_BASE (e.g. http://localhost:3333)",
    );
    return null;
  }

  socket = io(base, {
    autoConnect: false,
    // socket.io-client calls auth(cb) — must invoke cb with credentials
    auth: (cb) => {
      const token = getAccessToken();
      cb(token ? { token } : {});
    },
    withCredentials: true,
    transports: ["websocket", "polling"],
    extraHeaders: {
      "my-custom-header": "abcd",
    },
  });

  attachSocketListeners(socket);
  return socket;
}

function flushPendingEmits() {
  const client = getSocket();
  if (!client || !getAccessToken() || !client.connected) {
    return;
  }
  if (pendingUserId) {
    client.emit("add-user", pendingUserId);
  }
  if (pendingChannelRef?.name) {
    client.emit("addUserToChannel", pendingChannelRef);
  }
}

export function connectSocket() {
  const client = getSocket();
  const token = getAccessToken();
  if (!client) {
    return;
  }
  if (!token) {
    console.warn("[socket] connect skipped — no access token (log in again)");
    return;
  }
  applySocketAuth(client);
  if (!client.connected) {
    client.connect();
  } else {
    flushPendingEmits();
  }
}

export function setSocketUser(userId) {
  pendingUserId = userId != null ? String(userId) : null;
  connectSocket();
}

export function joinChannelRoom(channelRef) {
  if (!channelRef?.name) {
    return;
  }
  pendingChannelRef = channelRef;
  connectSocket();
}

export function reconnectSocketWithToken() {
  const client = getSocket();
  if (!client) {
    return;
  }
  applySocketAuth(client);
  if (client.connected) {
    client.disconnect();
  }
  if (getAccessToken()) {
    client.connect();
  }
}

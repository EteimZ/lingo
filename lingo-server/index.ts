import { createServer } from "http";
import { Server } from "socket.io";

import crypto from "crypto";

import InMemorySessionStore from "./stores/sessionStore";

// create http server
const httpServer = createServer();

// create an instance of socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const sessionStore = new InMemorySessionStore();
const randomId = () => crypto.randomBytes(8).toString("hex");

interface UserInterface{
  userID: string;
  username: string;
  connected: boolean;
}

// middleware
io.use((socket, next) => {

  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // If session is provided by the client check the session store for that user session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      // populate the socket data with the session details
      socket.data.sessionID = sessionID;
      socket.data.userID = session.userID;
      socket.data.username = session.username;
      return next();
    } else {
      return next(new Error("Session ID not found in store."))
    }
  }

  // if the session isn't provided a new information 
  // should created with the provided user details
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.data.sessionID = randomId();

  socket.data.userID = randomId();
  socket.data.sessionID = randomId();
  socket.data.username = username;

  sessionStore.saveSession(socket.data.sessionID, {
    userID: socket.data.userID,
    username: socket.data.username,
    connected: true
  })

  next();
});

io.on("connection", (socket) => {
  // emit session details
  socket.emit("session", {
    sessionID: socket.data.sessionID,
    userID: socket.data.userID
  })

  // join the "userID" room
  socket.join(socket.data.userID);

  // fetch existing users
  const users: UserInterface[] = [];
  sessionStore.findAllSession().forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
    })
  })

  // all currently existing users
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.data.userID,
    username: socket.data.username,
    connected: true,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).to(socket.data.userID).emit("private message", {
      content,
      from: socket.data.userID,
      to,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", async () => {
    // Check if all instance of this socket is disconnected
    const matchingSockets = await io.in(socket.data.userID).fetchSockets();
    const isDisconnected = matchingSockets.length === 0;
    if (isDisconnected){
      // notify other users
      socket.broadcast.emit("user disconnected", socket.data.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.data.sessionID, {
        userID: socket.data.userID,
        username: socket.data.username,
        connected: false,
      })
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);

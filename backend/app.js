const express = require("express");
const http = require("http");
const path = require("path");
const setupWebSocket = require('./websocket/setupWebsocket');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Configure Routes
app.get("/", (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.all("*", function (req, res) {
  return res.status(404).json({ status: 0, message: "*WOOSH* There's nothing here!"});
});

// Configure Websockets
const server = http.createServer(app);
setupWebSocket(server);

// Start the server
const APP_PORT = process.env.APPP_PORT || 3000;
const SOCK_PORT = process.env.APPP_PORT || 3001;

// app.listen(APP_PORT, () => {
//   console.log(`App listening on port ${APP_PORT}`);
// });

server.listen(SOCK_PORT, () => {
  console.log(`Websocket listening on port ${SOCK_PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = app;

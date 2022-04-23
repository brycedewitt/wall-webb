const WebSocket = require("ws");

let LIFETIME_CONNECTIONS = 0;

function setupWebSocket(app) {
  const wss = new WebSocket.Server({ noServer: true });

  const upgradeWss = (request, socket, head) => {
    try {
      wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit("connection", ws, request);
      });
    } catch (err) {
      console.log("error upgrading socket", err);
      socket.write(401);
      socket.destroy(err);
    }
  };

  const connectWss = ctx => {
    LIFETIME_CONNECTIONS++;
    console.log(`Current Connections: ${wss.clients.size} / Lifetime Connections: ${LIFETIME_CONNECTIONS}`);

    ctx.on("message", (message) => {
      console.log(`Client Says: ${message}`);
      ctx.send(`Server says: ${message}`);
    });

    ctx.on("close", () => {
      console.log("Closed Connection");
    });

    ctx.send("connection established.");
  }

  app.on("upgrade", upgradeWss);

  wss.on("connection", connectWss);
}

module.exports = setupWebSocket;
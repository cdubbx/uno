const { WebSocketServer } = require("ws");
const http = require("http");
const uuid = require('uuid').v4
// Create an HTTP server
const server = http.createServer();

// Initialize a WebSocket server instance
const wsServer = new WebSocketServer({ server });

const port = 8000;
const clients = new Set(); // Using a Set to store client connections
const clientQueue = []; // Array to keep track of the order of clients

// Broadcasts a message to all connected clients
const broadcast = (message) => {
  for (const client of clients) {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  }
};


// // going to make a random function called queue system 
// // Basically what we are going to do is get the order of which client joined in order
// To achieve this we going to make an order system excluding the uuid of the client
// Then we are going to send this object to the client so it can know what with order, so pretty much the other decks are going to be the other cards 



// Handle new WebSocket connections
wsServer.on("connection", (client) => {
  // Add the new client to the Set of clients
  console.log('Client connected. Total clients:', clients.size);

  clients.add(client);
  const uid = uuid()
  clientQueue.push({ client, uid });

  // When a client sends a message, broadcast it to all clients
  client.on("message", (message) => {
    const messageString = message.toString(); // Convert Buffer to string
    console.log('Message received from a client:', messageString);
    broadcast(messageString);  // Ensure to call broadcast here

    // Rest of your code...
  });
  

  // When a client disconnects, log and remove it from the Set
  client.on("close", () => {
    clients.delete(client);
    console.log('Client disconnected. Total clients:', clients.size);

    const index = clientQueue.findIndex((c) => c.uid === uid);
    if (index !== -1) {
      clientQueue.splice(index, 1); // Remove the client from the queue
    }

  });
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`WebSocket server is running on ws://localhost:${port}`);
});

const { WebSocketServer } = require("ws")
const http = require("http")
const uuidv4 = require("uuid").v4
const url = require("url")

// Even though WebSocket is a separate protocol from HTTP, 
// the WebSocket upgrade handshake happens over HTTP, meaning we need both.

const server = http.createServer()
const wsServer = new WebSocketServer({ server })

const port = 8000
const connections = {} // we make an empty dictionary for the connections
const users = {} // we make an empty dictionary for the users

const handleMessage = (bytes, uuid) => {
  const message = JSON.parse(bytes.toString()) // we can the message/state from the client 
  const user = users[uuid] // we assign a user to a user element in the users dictionary 
  user.state = message // we assign the user.state object to the message which shows the state of the user from the client 
  broadcast()

  console.log(
    `${user.username} updated their updated state: ${JSON.stringify(
      user.state,
    )}`,
  )
}

const handleClose = (uuid) => {
  console.log(`${users[uuid].username} disconnected`)
  delete connections[uuid]
  delete users[uuid]
  broadcast()
}

//dictionary and sends each client an up-to-date view of who’s connected and their state.
const broadcast = () => {
  Object.keys(connections).forEach((uuid) => { ///enumerates 
    const connection = connections[uuid] // it sets ea
    const message = JSON.stringify(users)
    connection.send(message)
  })
}



// Next, we add an event handler for incoming connections.
wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url, true).query // this line parse the url for the username 
  console.log(`${username} connected`)
  const uuid = uuidv4() // generates a uuid 
  connections[uuid] = connection // we set the one of 
  users[uuid] = {
    username, // we have the username that we get from the url
    state: {}, // we have an empty stay object that corresponds to the user's state 
  }
  connection.on("message", (message) => handleMessage(message, uuid)) //sends a message when the user logs 
  connection.on("close", () => handleClose(uuid)) // sends a message when the user logs off 
})

server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`)
})
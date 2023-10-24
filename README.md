# Lingo

A chat application

## Features 

- Direct messaging: Users can directly to one another.
- Presence: Users can see when other users are online.
- User session: The user session gets maintained across tabs. This currently maintained in memory on the server.
- Message persistence: User messages are persisted in memory on the server.

## Technologies

- React: UI library
- Socket.io: For bidirectional communication
- Chakra UI: Component library

## Usage

First get the server running:

```bash
cd lingo-server
npm i
npm run dev
```

Then get the application running:

```bash
cd lingo-app
npm i
npm run dev
```

It is a vite application possibly running on `http://localhost:5173`.

## Resources

- The current implementation of this application is based on the socket.io [private messaging example](https://socket.io/get-started/private-messaging-part-1/). Subsequently the architecture will be changed.

- React setup for socket.io is [here](https://socket.io/how-to/use-with-react) 

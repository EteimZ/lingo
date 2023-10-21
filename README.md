# Lingo

A chat application

## Features 

- Direct messaging

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
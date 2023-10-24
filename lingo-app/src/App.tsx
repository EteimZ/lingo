import {
  Box,
  Input,
  Button,
  HStack,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "./socket";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(()=>{
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
      navigate("list")
    }

    socket.on("session", ({ sessionID, userID }) => {
      socket.auth = { sessionID };

      localStorage.setItem("sessionID", sessionID);
      localStorage.setItem("userID", userID);
      //navigate("list");
    })

  })

  function submitUsername(){
    socket.auth = { username };
    socket.connect();
    navigate("list")
  }

  return (
    <>
      <Box border={2} h="100vh" m={4}>
        <AbsoluteCenter>
          <HStack w="50vw">
            <Input
              value={username}
              placeholder="Enter username"
              onChange={(event) => setUsername(event.target.value)}
            />
            <Button
              onClick={() => submitUsername() }
              isDisabled={username === ""}
              colorScheme="green"
            >
              {" "}
              Register{" "}
            </Button>
          </HStack>
        </AbsoluteCenter>
      </Box>
    </>
  );
}

export default App;

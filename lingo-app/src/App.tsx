import {
  Box,
  Input,
  Button,
  HStack,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "./socket";

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

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

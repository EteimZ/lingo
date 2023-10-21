import { Button, Box, Flex, HStack, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../socket";

interface Message {
  content: string;
  userID: string;
}

function ChatDetail() {
  const { userID } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("private message", ({ content, from }) => {
      setMessages([...messages, { content, userID: from }]);
    });
  });

  function sendMessage(content: string) {
    socket.emit("private message", {
      content,
      to: userID,
    });
    setMessages([...messages, { content, userID: socket.id }]);
    setText("");
  }

  return (
    <>
      <Flex direction="column" h="95vh" padding={4}>
        <Box mb={10} flex={1} overflow="auto">
          {messages.map((message, index) => (
            <div key={index}>
              <strong>{message.userID}: </strong>
              {message.content}
            </div>
          ))}
        </Box>
        <Box pos="absolute" left={0} bottom={0} right={0}>
          <HStack paddingX={10}>
            <Input
              value={text}
              placeholder="Enter message"
              style={{ backgroundColor: "white" }}
              onChange={(event) => setText(event.target.value)}
            />
            <Button
              onClick={() => sendMessage(text)}
              isDisabled={text === ""}
              colorScheme="green"
            >
              Send
            </Button>
          </HStack>
        </Box>
      </Flex>
    </>
  );
}

export default ChatDetail;

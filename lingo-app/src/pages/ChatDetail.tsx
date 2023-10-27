import { Button, Box, Flex, HStack, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../socket";

interface Message {
  content: string;
  userID: string;
  fromSelf: boolean;
}

function ChatDetail() {
  const { userID, username } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const yourID = localStorage.getItem("userID");
    
    fetch(`http://localhost:4000/messages/${userID}/${yourID}`) // Replace with the actual API URL
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [userID]);

  useEffect(() => {
    socket.on("private message", ({ content, from }) => {
      setMessages([...messages, { content, userID: from, fromSelf: false }]);
    });

    return () => {
      socket.off("private message");
    };
  }, [messages]);

  function sendMessage(content: string) {
    socket.emit("private message", {
      content,
      to: userID,
    });
    setMessages([...messages, { content, userID: socket.id, fromSelf: true }]);
    setText("");
  }

  return (
    <>
      <Flex direction="column" h="100vh" padding={4} position={"relative"}>
          <Box mb={10} flex={1} overflow="auto">
            {messages.map((message, index) => (
              <Box key={index} border={"1px"} borderRadius={"2xl"} marginBottom={"1.5"} maxWidth={"280px"} wordBreak={"break-word"} padding={"3"} color={"whiteAlpha.800"} borderColor={"black"}>
                <strong>{message.fromSelf ?  "You:" : username} </strong>
                {message.content}
              </Box>
            ))}
          </Box>
          <Box pos="absolute" left={0} bottom={1} right={0}>
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

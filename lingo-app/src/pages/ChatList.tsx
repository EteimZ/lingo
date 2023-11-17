import { Avatar, AvatarBadge, Center, HStack, Heading, Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ChatDetail from "../components/ChatDetail";

import socket from "../socket";

interface User {
  userID: string;
  username: string;
  connected: boolean;
}

function ChatList() {

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser  ] = useState({username: "", userID: ""})

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (!socket.connected){
      console.log("Not connected!")
      socket.auth = { sessionID };
      socket.connect();

    } else{
      console.log("Connected!")
    }

    socket.on("users", (users_from) => {
      console.log(users_from)
      setUsers(users_from);
    });

    socket.on("user connected", (user_in) => {
      const user: User | undefined = users.find((element) => element.userID == user_in.userID)
      if (user){
        setUsers(prevItems => {
          return prevItems.map(item => {
            if (item.userID === user.userID) {
              return { ...user_in };
            }
            return item;
          });
        });
      } else{
        setUsers([...users, user_in]);
      }
    });

    socket.on("user disconnected", (user_in) => {
        setUsers(prevItems => {
          return prevItems.map(item => {
            if (item.userID === user_in) {
              return { ...item, connected: false };
            }
            return item;
          });
        });
      }
    );

    return () => {
      socket.off("users");
      socket.off("user connected");
    };
  }, [users]);

  return (
    <>
      <Box h={"100vh"} bg={"black.400"}>
      <Grid templateColumns={"25% 75%"} bg={"green.500"}>
      <GridItem bg={"teal.800"}>
        <Center>
          <Heading color="green.400">List of chats</Heading>
        </Center>
        {users.map(({ username, userID, connected }, index) => (
          <HStack
            boxShadow="base"
            borderColor="green.200"
            borderRadius={4}
            cursor="pointer"
            p={2}
            mx={2}
            my={2}
            key={index}
            onClick={() => setSelectedUser({"username": username, "userID": userID })}
          >
            <Avatar
            name={username}
            src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
          >
            { connected ? <AvatarBadge boxSize="1.25em" bg="green.500" /> :
            <AvatarBadge boxSize="1.25em" bg="red.500" /> }
          </Avatar>        
            <Text color={"yellow.500"}>{username}</Text>
          </HStack>
        ))}
        </GridItem>
  
        <GridItem bg={"teal.600"}>
        <ChatDetail username={selectedUser.username} userID = {selectedUser.userID}/>
        </GridItem>

        </Grid>
        </Box>
    </>
  );
}

export default ChatList;
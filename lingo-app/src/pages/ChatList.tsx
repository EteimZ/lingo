import { Avatar, Center, HStack, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../socket";

interface Users {
  username: string;
  userID: string;
}

function ChatList() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    socket.on("users", (users_from) => {
      setUsers(users_from);
    });

    socket.on("user connected", (user_in) => {
      setUsers([...users, user_in]);
    });

    return () => {
      socket.off("users");
      socket.off("user connected");
    };
  }, [users]);

  return (
    <>
      <Center>
        <Heading color="green.400">List of chats</Heading>
      </Center>
      {users.map(({ username, userID }, index) => (
        <HStack
          boxShadow="base"
          borderColor="green.200"
          borderRadius={4}
          cursor="pointer"
          p={2}
          mx={2}
          my={2}
          key={index}
          onClick={() => navigate(`/detail/${username}/${userID}`)}
        >
          <Avatar
            name={username}
            src="https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg"
          />
          <p>{username}</p>
        </HStack>
      ))}
    </>
  );
}

export default ChatList;

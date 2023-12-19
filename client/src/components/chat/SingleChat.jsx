import {
  Alert,
  AlertIcon,
  Box,
  Button,
  HStack,
  Input,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  allMessages,
  receiveMessage,
  sendMessage,
} from "../../redux/slices/messageSlice";
import MessageList from "../message/MessageList";
const ENDPOINT = "http://localhost:8000";
import io from "socket.io-client";
import { addNotif } from "../../redux/slices/notifSlice";
var socket, selectedChatCompare;

const SingleChat = ({ chatId }) => {
  const inpMessage = useRef();
  const { loading, messages } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const { selectedChat } = useSelector((state) => state.chat);
  const { notification } = useSelector((state) => state.notif);

  const dispatch = useDispatch();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    return () => {
      // Cleanup socket connection when the component unmounts
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    dispatch(allMessages(chatId));
    socket.emit("join chat", chatId);
    selectedChatCompare = selectedChat;
  }, [chatId]);

  useEffect(() => {
    socket.on("message recieved", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Do nothing if the chat doesn't match the selected chat
        if (!notification.includes(newMessageReceived)) {
          dispatch(addNotif(newMessageReceived));
        }
      } else {
        dispatch(receiveMessage(newMessageReceived));
      }
    });
  }, []);

  const sendMessageTo = () => {
    const data = {
      content: inpMessage.current.value,
      chatId,
    };
    dispatch(sendMessage({ data, socket }));
    inpMessage.current.value = "";
  };

  return (
    <>
      <Box
        position={"relative"}
        height={"calc(100vh - 200px)"}
        p={2}
        bg={"gray.300"}
        overflowY={"hidden"}
        display={"flex"}
        flexDir={"column"}
        overflowX={"hidden"}
      >
        {loading === "loading" ? (
          <>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              w={20}
              h={20}
              alignSelf={"center"}
              margin={"auto"}
              size="xl"
            />
          </>
        ) : (
          <></>
        )}
        {loading === "failed" ? (
          <Alert status="error" mt={5}>
            <AlertIcon />
            There was an error processing your request
          </Alert>
        ) : (
          <></>
        )}
        {/* messages */}
        <VStack>
          {loading === "succeeded" && <MessageList messages={messages} />}
        </VStack>
        <HStack position={"absolute"} bottom={3} w={"full"} px={3}>
          <Input
            ref={inpMessage}
            borderColor={"gray.900"}
            variant="outline"
            placeholder="Type message..."
            _placeholder={{ opacity: 1, color: "gray.500" }}
          />
          <Button onClick={sendMessageTo} colorScheme="blue">
            Send
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default SingleChat;

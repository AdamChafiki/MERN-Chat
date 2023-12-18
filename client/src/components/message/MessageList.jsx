import { Avatar, Box, Text, useStyleConfig } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function MessageList({ messages }) {
  const { user } = useSelector((state) => state.auth);
  const messageListRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the message list when it updates
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const styles = useStyleConfig("Box", { variant: "message" });

  return (
    <MotionBox
      ref={messageListRef}
      overflowY="auto"
      w="full"
      height="calc(100vh - 250px)"
      sx={{
        ...styles,
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#8ACDD7",
        },
      }}
    >
      {messages.length > 0 ? (
        messages.map((message) => (
          <MotionBox
            display={"flex"}
            justifyItems={"center"}
            width={"fit-content"}
            key={message._id}
            mb={4}
            ml={message.sender._id === user._id ? "auto" : 0}
            mr={message.sender._id !== user._id ? "auto" : 0}
            textAlign={message.sender._id === user._id ? "right" : "left"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Avatar src={message.sender.avatar} size={"xs"} m={2} />
            <Text
              bg={message.sender._id === user._id ? "blue.400" : "blue.800"}
              color="white"
              p={3}
              borderRadius="md"
            >
              {message.content}
            </Text>
          </MotionBox>
        ))
      ) : (
        <Text>No messages available.</Text>
      )}
    </MotionBox>
  );
}

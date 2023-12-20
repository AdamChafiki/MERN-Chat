import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { ViewIcon, SettingsIcon } from "@chakra-ui/icons";
import SingleChat from "./SingleChat";
import ModalGroupChatSetting from "./ModalGroupChatSetting";

const ChatBox = () => {
  const { selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getSender = (users) => {
    const currentUserId = user._id;
    const filterUsers = users.filter((user) => user._id !== currentUserId);

    if (filterUsers.length > 0) {
      return filterUsers[0].username;
    } else {
      return "Unknown User";
    }
  };

  return (
    <section className="p-2 w-full md:w-2/3">
      <Box bg="white" p={3} rounded={"lg"} height={"calc(100vh - 120px)"}>
        {selectedChat ? (
          <>
            <Box display={"flex"} justifyContent={"space-between"} py={3}>
              <Text fontFamily={"Work sans"} fontSize="2xl">
                {!selectedChat.isGroupChat ? (
                  <>{getSender(selectedChat.users)}</>
                ) : (
                  <>{selectedChat.chatName}</>
                )}
              </Text>
              {!selectedChat.isGroupChat ? (
                <Tooltip label={getSender(selectedChat.users)}>
                  <ViewIcon />
                </Tooltip>
              ) : (
                <Box display={"flex"} justifyItems={"center"}>
                  <ModalGroupChatSetting
                    isOpen={isOpen}
                    onClose={onClose}
                    chatId={selectedChat._id}
                  />

                  {selectedChat.groupAdmin._id === user._id && (
                    <Button
                      bg="none"
                      size="xs"
                      onClick={onOpen}
                      fontSize="md" // Set the desired font size here
                    >
                      <SettingsIcon />
                    </Button>
                  )}
                  <Tooltip label={selectedChat.chatName}>
                    <ViewIcon boxSize={5} />
                  </Tooltip>
                </Box>
              )}
            </Box>
            <SingleChat chatId={selectedChat?._id} />
          </>
        ) : (
          <Center h={"full"}>
            <Heading size="3xl" fontFamily={"Work sans"}>
              Select a chat!
            </Heading>
          </Center>
        )}
      </Box>
    </section>
  );
};

export default ChatBox;

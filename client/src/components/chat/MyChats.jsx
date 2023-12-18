import {
  Box,
  Heading,
  Alert,
  AlertIcon,
  HStack,
  Button,
  List,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import { useDispatch, useSelector } from "react-redux";
import SkeletonLoader from "../loader/SkeletonLoader";
import { useEffect } from "react";
import { fetchChats } from "../../redux/slices/chatSlice";
import MyChatsList from "./MyChatsList";
import ModalGroupChat from "./ModalGroupChat";
const MyChats = () => {
  const { loading, chats } = useSelector((state) => state.chat);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChats());
  }, []);

  return (
    <aside className="p-2 w-full md:w-1/3 ">
      <Box
        bg="white"
        p={3}
        rounded={"lg"}
        height={"calc(100vh - 120px)"}
      >
        <HStack
          display={"flex"}
          justifyItems={"center"}
          justifyContent={"space-between"}
        >
          <Heading as="h1" size="md">
            My chats
          </Heading>
          <ModalGroupChat isOpen={isOpen} onClose={onClose} />
          <Button
            onClick={onOpen}
            rightIcon={<AddIcon />}
            colorScheme="blue"
            variant="outline"
          >
            Create group
          </Button>
        </HStack>
        {loading === "loading" ? <SkeletonLoader /> : <></>}
        {loading === "failed" ? (
          <Alert status="error" mt={5}>
            <AlertIcon />
            There was an error processing your request
          </Alert>
        ) : (
          <></>
        )}
        {loading === "succeeded" && chats.length > 0 && (
          <List spacing={6} mt={5}>
            {chats.map((chat) => (
              <MyChatsList key={chat._id} chat={chat} />
            ))}
          </List>
        )}
      </Box>
    </aside>
  );
};

export default MyChats;

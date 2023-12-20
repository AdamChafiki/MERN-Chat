import {
  Button,
  Input,
  List,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  HStack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../redux/slices/userSlice";
import SkeletonLoader from "../loader/SkeletonLoader";
import UserSearch from "../user/UserSearch";
import { createGroupChat } from "../../redux/slices/chatSlice";
import Loader from "../loader/Loader";

export default function ModalGroupChat({ isOpen, onClose }) {
  const [usersSearch, setUsersSearch] = useState([]);
  const nameInp = useRef();
  const dispatch = useDispatch();
  const { loading, users } = useSelector((state) => state.user);
  const { loading: lg } = useSelector((state) => state.chat);

  const toast = useToast();

  const handleCreateGroup = () => {
    const userIds = [];

    if (usersSearch.length <= 1) {
      toast({
        title: "Group Chat Requires at Least Two Users",
        description: "Please add at least two users for a group chat.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    usersSearch.map((user) => userIds.push(user.userId));
    const dataJson = JSON.stringify(userIds);
    const data = {
      name: nameInp.current.value,
      users: dataJson,
    };
    dispatch(createGroupChat(data));
  };

  const handleDeleteTag = (userId) => {
    setUsersSearch(usersSearch.filter((user) => user.userId !== userId));
  };

  const handleSearch = (key) => {
    if (!key) {
      return;
    }
    dispatch(searchUser(key));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create group chat</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack spacing={3} my={3}>
            {usersSearch.length > 0 ? (
              <>
                {usersSearch.map((u) => (
                  <Tag
                    size={"sm"}
                    key={u.userId}
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                  >
                    {lg === "loading" && <Spinner size="xs" mr={2} />}

                    <TagLabel>{u.name}</TagLabel>
                    <TagCloseButton onClick={() => handleDeleteTag(u.userId)} />
                  </Tag>
                ))}
              </>
            ) : (
              <Text as="b" my={3} color={"blue"}>
                At least 2 users
              </Text>
            )}
          </HStack>

          <Stack spacing={3} px={3}>
            <Input ref={nameInp} variant="outline" placeholder="Name" />
            <Input
              onChange={(e) => handleSearch(e.target.value)}
              variant="outline"
              placeholder="Add users"
            />
          </Stack>
          {loading === "loading" ? <SkeletonLoader /> : <></>}
          {loading === "failed" ? (
            <p className="py-2 font-semibold">User not found !</p>
          ) : (
            <></>
          )}
          {loading === "succeeded" ? (
            <>
              <List spacing={6} mt={5}>
                {users.map((user) => (
                  <UserSearch
                    key={user._id}
                    user={user}
                    usersSearch={usersSearch}
                    setUsersSearch={setUsersSearch}
                  />
                ))}
              </List>
            </>
          ) : (
            <></>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCreateGroup} colorScheme="green" mr={3}>
            Create
          </Button>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

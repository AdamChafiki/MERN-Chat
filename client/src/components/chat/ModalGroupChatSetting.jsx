import {
  Button,
  HStack,
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
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserToGroup,
  fetchChats,
  renameGroupChat,
} from "../../redux/slices/chatSlice";
import SkeletonLoader from "../loader/SkeletonLoader";
import UserSearch from "../user/UserSearch";
import { searchUser } from "../../redux/slices/userSlice";

const ModalGroupChatSetting = ({ isOpen, onClose, chatId }) => {
  const nameInp = useRef();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.chat);
  const { loading: ls, users } = useSelector((state) => state.user);

  const [usersSearch, setUsersSearch] = useState([]);

  const toast = useToast();
  const handleDeleteTag = (userId) => {
    setUsersSearch(usersSearch.filter((user) => user.userId !== userId));
  };

  const handleSearch = (key) => {
    if (!key) {
      return;
    }
    dispatch(searchUser(key));
  };
  const handleRenameChatGroup = () => {
    if (usersSearch.length == 1) {
      const userData = {
        chatId,
        userId: usersSearch[0].userId,
      };
      return dispatch(addUserToGroup({ userData, toast }));
    }
    if (nameInp.current.value !== "") {
      const data = {
        chatId,
        chatName: nameInp.current.value,
      };

      return dispatch(renameGroupChat({ data, onClose, fetchChats }));
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update group</ModalHeader>
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
                    <TagLabel>{u.name}</TagLabel>
                    <TagCloseButton onClick={() => handleDeleteTag(u.userId)} />
                  </Tag>
                ))}
              </>
            ) : (
              <Text as="b" my={3} color={"blue"}>
                At least 1 users
              </Text>
            )}
          </HStack>
          <Stack spacing={3} px={3}>
            <Input ref={nameInp} variant="outline" placeholder="Name" />
            <Input
              variant="outline"
              placeholder="Add user"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Stack>
          {ls === "loading" ? <SkeletonLoader /> : <></>}
          {ls === "failed" ? (
            <p className="py-2 font-semibold">User not found !</p>
          ) : (
            <></>
          )}
          {ls === "succeeded" ? (
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
          <Button
            isLoading={loading === "loading"}
            colorScheme="green"
            mr={3}
            onClick={handleRenameChatGroup}
          >
            Save
          </Button>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalGroupChatSetting;

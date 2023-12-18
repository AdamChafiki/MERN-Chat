import { Avatar, ListItem, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { curretChat } from "../../redux/slices/chatSlice";

const MyChatsList = ({ chat }) => {
  const { user } = useSelector((state) => state.auth);
  const { selectedChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const getSender = (users) => {
    const currentUserId = user._id;
    const filterUsers = users.filter((user) => user._id !== currentUserId);

    if (filterUsers.length > 0) {
      return filterUsers[0];
    } else {
      return "Unknown User";
    }
  };

  const handleChatClick = (chat) => {
    dispatch(curretChat(chat));
  };

  return (
    <>
      <ListItem
        display="flex"
        cursor="pointer"
        bg={selectedChat?._id === chat._id ? "blue.300" : "#EEF0E5"}
        rounded="lg"
        color={selectedChat?._id === chat._id ? "white" : "black"}
        p={2}
        _hover={{
          background: "blue.300",
          color: "white",
        }}
        onClick={() => handleChatClick(chat)}
      >
        <Avatar src={getSender(chat.users).username} size="xs" mr={2} />
        {!chat.isGroupChat ? (
          <Text>{getSender(chat.users).username}</Text>
        ) : (
          <Text>{chat.chatName}</Text>
        )}
      </ListItem>
    </>
  );
};

MyChatsList.propTypes = {
  chat: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isGroupChat: PropTypes.bool.isRequired,
    chatName: PropTypes.string,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default MyChatsList;

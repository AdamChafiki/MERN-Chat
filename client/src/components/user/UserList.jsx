import PropTypes from "prop-types";
import { Avatar, ListItem, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { accessChat } from "../../redux/slices/chatSlice";

const UserList = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const handleAccessChat = (userId) => {
    dispatch(accessChat(userId));
    onClose();
  };
  return (
    <ListItem
      onClick={() => handleAccessChat(user?._id)}
      display="flex"
      cursor={"pointer"}
      bg="#EEF0E5"
      rounded={"lg"}
      p={2}
      _hover={{
        background: "green.300",
        color: "white",
      }}
    >
      <Avatar src={user?.avatar} size="xs" mr={2} />
      <Text>{user?.username}</Text>
    </ListItem>
  );
};

UserList.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
};

export default UserList;

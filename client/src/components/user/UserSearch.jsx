import PropTypes from "prop-types";
import { Avatar, ListItem, Text } from "@chakra-ui/react";

const UserSearch = ({ user, setUsersSearch, usersSearch }) => {

    
  const handleTag = (userInfo) => {
    setUsersSearch((prev) => [...prev, userInfo]);
  };
  return (
    <ListItem
      onClick={() => handleTag({ userId: user?._id, name: user?.username })}
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

UserSearch.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
};

export default UserSearch;

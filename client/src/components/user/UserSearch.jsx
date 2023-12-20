import { Avatar, ListItem, Text, useToast } from "@chakra-ui/react";
import PropTypes from "prop-types";

const UserSearch = ({ user, setUsersSearch, usersSearch }) => {
  const toast = useToast();

  const isEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handleTag = (userInfo) => {
    if (!usersSearch.some((user) => isEqual(user, userInfo))) {
      setUsersSearch((prev) => [...prev, userInfo]);
    } else {
      toast({
        title: "Name Already Exists",
        description: "This name already exists in the tag.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
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

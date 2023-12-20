import {
  Button,
  useDisclosure,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Avatar,
  Text,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, BellIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import SideDrawer from "../sideDrawer/SideDrawer";
import { allMessages } from "../../redux/slices/messageSlice";
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { notification } = useSelector((state) => state.notif);
  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logoutUser());
    nav("/auth/login");
  };
  return (
    <>
      <SideDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
      <header className="bg-white p-4 flex justify-between items-center">
        <Button ref={btnRef} colorScheme="blue" onClick={onOpen}>
          <SearchIcon mr={2} /> Search
        </Button>
        <div className="flex items-center">
          <Menu>
            <Box position={"relative"} mr={2}>
              <MenuButton as={BellIcon} cursor="pointer" h={6} w={6} />
              <span className="absolute bg-red-600 w-3 h-3 text-center text-white p-2 top-0 right-0 rounded-full flex items-center justify-center">
                <Text fontSize="xs">{notification.length}</Text>
              </span>
            </Box>

            <MenuList p={2}>
              {notification.length > 0 ? (
                <>
                  {notification.map((message) => (
                    <MenuItem key={message.id}>
                      <HStack
                        onClick={() => {
                          dispatch(allMessages(message.chat._id));
                        }}
                        spacing={3}
                      >
                        <Avatar src={message.sender.avatar} size={"xs"} m={2} />
                        <Text> {message.sender.username}:</Text>
                        <Text> {message.content}</Text>
                      </HStack>
                    </MenuItem>
                  ))}
                </>
              ) : (
                <Text>No notification</Text>
              )}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Avatar}
              src={user?.avatar}
              cursor="pointer"
              h={8}
              w={8}
            />

            <MenuList>
              <MenuItem>Setting</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </header>
    </>
  );
};

export default Header;

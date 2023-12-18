import {
  Button,
  useDisclosure,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  Avatar,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, BellIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import SideDrawer from "../sideDrawer/SideDrawer";
const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
          <BellIcon boxSize={6} mr={2} />
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

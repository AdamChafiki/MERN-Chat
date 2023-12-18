import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  HStack,
  List,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../../redux/slices/userSlice";
import SkeletonLoader from "../loader/SkeletonLoader";
import UserList from "../user/UserList";
const SideDrawer = ({ isOpen, onClose, btnRef }) => {
  const searchRef = useRef();
  const dispatch = useDispatch();
  const { loading, users } = useSelector((state) => state.user);

  const handleSearch = (event) => {
    event.preventDefault();
    const key = searchRef.current.value;
    dispatch(searchUser(key));
    searchRef.current.value = "";
  };
  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Seach for a user</DrawerHeader>
        <DrawerBody>
          <HStack spacing={2}>
            <Input ref={searchRef} placeholder="Search here..." />
            <Button onClick={handleSearch} colorScheme="green">
              Search
            </Button>
          </HStack>
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
                  <UserList key={user._id} user={user} onClose={onClose} />
                ))}
              </List>
            </>
          ) : (
            <></>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;

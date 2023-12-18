import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/loader/Loader";
import { registerUser } from "../../redux/slices/authSlice";
import { Toaster } from "sonner";

const Register = () => {
  const inpUsername = useRef(null);
  const inpEmail = useRef(null);
  const inpPassword = useRef(null);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleRegister = (event) => {
    event.preventDefault();
    const username = inpUsername.current.value;
    const email = inpEmail.current.value;
    const password = inpPassword.current.value;
    const data = { username, email, password };
    dispatch(registerUser(data));
    inpUsername.current.value = "";
    inpEmail.current.value = "";
    inpPassword.current.value = "";
  };

  return (
    <>
      {loading === "loading" ? <Loader /> : <></>}

      <section className="min-h-screen bg-slate-300 grid place-items-center ">
        <Toaster richColors />
        <main className="bg-white w-96 rounded-2xl shadow-lg p-4">
          <div className="mb-5">
            <img src={Logo} alt="logo" className="mx-auto w-24" />
          </div>
          <form className="flex flex-col space-y-6 mb-5">
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input ref={inpUsername} type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input ref={inpEmail} type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input ref={inpPassword} type="password" />
            </FormControl>
            <Button
              type="button"
              colorScheme="blue"
              variant="outline"
              onClick={handleRegister}
            >
              Register
            </Button>
          </form>
          <Link
            to="/auth/login"
            className="text-blue-600 hover:underline hover:text-black"
          >
            Go to login
          </Link>
        </main>
      </section>
    </>
  );
};

export default Register;

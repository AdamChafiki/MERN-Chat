import Logo from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import Loader from "../../components/loader/Loader";
import { useRef, useState } from "react";
import { loginUser } from "../../redux/slices/authSlice";
const Login = () => {
  const [error, setError] = useState(null);
  const inpEmail = useRef(null);
  const inpPassword = useRef(null);
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    const email = inpEmail.current.value;
    const password = inpPassword.current.value;
    const data = { email, password, setError, nav };
    dispatch(loginUser(data));
    inpEmail.current.value = "";
    inpPassword.current.value = "";
  };

  return (
    <>
      {loading === "loading" ? <Loader /> : <></>}

      <section className="min-h-screen bg-slate-300 grid place-items-center  ">
        <main className="bg-white w-96 rounded-2xl shadow-lg p-4">
          <div className="mb-5">
            <img src={Logo} alt="logo" className="mx-auto w-24" />
          </div>
          {/* Alert for error */}
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          {/* form login */}
          <form className="flex flex-col space-y-6 mb-5">
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input ref={inpEmail} type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input ref={inpPassword} type="password" />
            </FormControl>
            <Button colorScheme="blue" variant="outline" onClick={handleLogin}>
              Login
            </Button>
          </form>
          <Link
            to="/auth/register"
            className="text-blue-600 hover:underline hover:text-black"
          >
            Go to Register
          </Link>
        </main>
      </section>
    </>
  );
};

export default Login;

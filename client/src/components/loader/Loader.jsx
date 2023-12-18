import { InfinitySpin } from "react-loader-spinner";
const Loader = () => {
  return (
    <section className="bg-white fixed z-50 w-full min-h-screen grid place-content-center">
      <InfinitySpin  color="blue" />
    </section>
  );
};

export default Loader;

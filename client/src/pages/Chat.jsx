import ChatBox from "../components/chat/ChatBox";
import MyChats from "../components/chat/Mychats";
import Header from "../components/header/Header";

const Chat = () => {


  return (
    <section className="bg-slate-300 min-h-screen">
      <Header />
      <section className="mt-5 flex  flex-wrap">
        <MyChats />
        <ChatBox/>
      </section>
    </section>
  );
};

export default Chat;

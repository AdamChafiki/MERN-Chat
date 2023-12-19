require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connDb");
const { errorHandler, notFound } = require("./middlewares/error");
// Connect to mongoDb
connectDb();

// Init App
const app = express();

// Middlewares
app.use(express.json());

// Cors policy
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api", require("./routes/userRoute"));
app.use("/api", require("./routes/chatRoute"));
app.use("/api", require("./routes/messageRoute"));

//  Error handler middlware
app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log("join room " + roomId);
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    if (chat.groupAdmin !== newMessageRecieved.sender._id) {
      socket.in(chat.groupAdmin).emit("message recieved", newMessageRecieved);
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

 

  socket.off("setup", () => {
    console.log("user disconnected");
    socket.leave(userData._id);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

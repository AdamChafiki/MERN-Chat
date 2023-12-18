const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Conected to mongoDb ^_^");
  } catch (error) {
    console.log("Fialed to cennect to mongoDb : " + error);
  }
};

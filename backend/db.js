require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected succesfully");
  })
  .catch((error) => {
    console.error("Error connecting MongoDB:", error.message);
  });

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

const todoModel = mongoose.model("todos", todoSchema);

module.exports = {
  todoModel: todoModel,
};

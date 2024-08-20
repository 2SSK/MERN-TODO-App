require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { createTodo, updateTodo } = require("./types");
const { todoModel } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post("/todo", (req, res) => {
  const createPayload = req.body;

  const parsedPayload = createTodo.safeParse(createPayload);

  if (!parsedPayload.success) {
    return res.status(411).json({
      msg: "you sent the wrong inputs",
      errors: parsedPayload.error.errors,
    });
  }
  const newTodo = new todoModel({
    task: parsedPayload.data.task,
    status: parsedPayload.data.status || false,
  });

  newTodo
    .save()
    .then((savedTodo) => res.status(201).json(savedTodo))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();

    res.status(200).json(todos);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error in fetching todos", error: error.message });
  }
});

app.put("/completed", async (req, res) => {
  const updatePayload = req.body;

  const parsedPayload = updateTodo.safeParse(updatePayload);

  if (!parsedPayload.success) {
    return res.status(411).json({
      msg: "you sent the wrong inputs",
      errors: parsedPayload.error.errors,
    });
  }

  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      parsedPayload.data._id,
      { status: parsedPayload.data.status },
      { new: true },
    );

    if (!updatedTodo) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error in updating todo", error: error.message });
  }
});

app.delete(`/todo/:id`, async (req, res) => {
  const todoId = req.params.id;

  try {
    const deleteTodo = await todoModel.findByIdAndDelete(todoId);

    if (!deleteTodo) {
      return res.status(404).json({ msg: "Todo not found" });
    }

    res.status(200).json({ msg: "Todo deleted succesfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error in deleting todo", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

const z = require("zod");

const createTodo = z.object({
  task: z.string().min(1, "Task is required"),
  status: z.boolean().optional(),
});

const updateTodo = z.object({
  _id: z.string().min(1, "Id is required"),
  status: z.boolean(),
});

module.exports = {
  createTodo: createTodo,
  updateTodo: updateTodo,
};

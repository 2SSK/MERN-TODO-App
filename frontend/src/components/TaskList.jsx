import React, { useEffect, useState } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Failed to fetch tasks:", error));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;

    fetch("http://localhost:3000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask, status: false }),
    })
      .then((response) => response.json())
      .then((newTask) => setTasks([...tasks, newTask]))
      .catch((error) => console.error("Failed to add task:", error));

    setNewTask("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleTask = (taskId) => {
    const task = tasks.find((t) => t._id === taskId);

    fetch("http://localhost:3000/completed", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: taskId, status: !task.status }),
    })
      .then((response) => response.json())
      .then((updatedTask) =>
        setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t))),
      )
      .catch((error) => console.error("Failed to update task:", error));
  };

  const deleteTask = (taskId) => {
    fetch(`http://localhost:3000/todo/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => setTasks(tasks.filter((task) => task._id !== taskId)))
      .catch((error) => console.error("Failed to delete task:", error));
  };

  return (
    <div>
      <div className="row">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add your task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            className={task.status ? "checked" : ""}
            onClick={() => toggleTask(task._id)}
          >
            <p>{task.task}</p>
            <span onClick={() => deleteTask(task._id)}>&times;</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

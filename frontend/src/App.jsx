import React from "react";

import TaskList from "./components/TaskList";

const App = () => {
  return (
    <div className="container">
      <h2>
        TODO App <img src="/icon.png" alt="" />
      </h2>
      <TaskList />
    </div>
  );
};

export default App;

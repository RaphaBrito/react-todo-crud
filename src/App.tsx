import React, { useState, useEffect } from "react";
import "./App.css";
import { Todo } from "./types/Todo";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  return (
    <div>
      <h1>Lista de Tarefas</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h3>{todo.text}</h3>
            <button>{todo.completed ? "Recomeçar" : "Concluir"}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import "./App.css";
import { Todo } from "./types/Todo";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = () =>
    fetch("http://localhost:5000/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));

  const handleCreateTodo = () => {
    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTodo, completed: false }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTodos([...todos, data]);
        setNewTodo("");
      });
  };

  const handleUpdateTodo = (todo: Todo) => {
    // Implemente a lógica de atualização aqui
  };

  const handleDeleteTodo = (todo: Todo) => {
    fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTodo, completed: false }),
    }).then(getTodos);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nova tarefa"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={handleCreateTodo}>Adicionar Tarefa</button>
      <h1>Lista de Tarefas</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h3>{todo.text}</h3>
            <div className="item-buttons">
              <button onClick={() => handleUpdateTodo(todo)}>
                {todo.completed ? "Recomeçar" : "Concluir"}
              </button>
              <button onClick={() => handleDeleteTodo(todo)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

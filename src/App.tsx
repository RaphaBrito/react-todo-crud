import { useEffect, useState } from "react";
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
        setTodos((oldTodos) => [...oldTodos, data]);
        setNewTodo("");
      });
  };

  const handleUpdateTodo = (todo: Todo) => {
    fetch(`http://localhost:5000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    }).then(() => getTodos());
  };

  const handleDeleteTodo = (id: number) => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => getTodos());
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nova Tarefa"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={handleCreateTodo}>Criar nova tarefa</button>
      <h1>Lista de Tarefas:</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h3>{todo.text}</h3>
            <button onClick={() => handleUpdateTodo(todo)}>
              {todo.completed ? "Recomeçar" : "Finalizar"}
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

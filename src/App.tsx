import React from "react";
import "./App.css";
import { Todo } from "./types/Todo";
import { useQuery, useMutation, useQueryClient } from "react-query";

function App() {
  const queryClient = useQueryClient();
  // Query para buscar todas as tarefas
  const { data: todos, isFetching } = useQuery("todos", async () => {
    const response = await fetch("http://localhost:5000/todos");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });

  // Mutação para criar uma nova tarefa
  const createTodoMutation = useMutation(
    async (newTodo: string) => {
      const response = await fetch("http://localhost:5000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newTodo, completed: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to create a new todo");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos"); // Invalida a query de tarefas para atualizar a lista
      },
    }
  );

  const handleCreateTodo = (newTodo: string) => {
    createTodoMutation.mutate(newTodo);
  };

  const updateTodoMutation = useMutation(
    async (updatedTodo: Todo) => {
      const response = await fetch(
        `http://localhost:5000/todos/${updatedTodo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTodo),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update the todo");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos"); // Invalida a query de tarefas para atualizar a lista
      },
    }
  );

  const handleUpdateTodo = (todo: Todo) => {
    updateTodoMutation.mutate({ ...todo, completed: !todo.completed });
  };

  const deleteTodoMutation = useMutation(
    async (id: number) => {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete the todo");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos"); // Invalida a query de tarefas para atualizar a lista
      },
    }
  );

  const handleDeleteTodo = (todo: Todo) => {
    deleteTodoMutation.mutate(todo.id);
  };

  if (isFetching) {
    return <h1>Carregando a lista de tarefas...</h1>;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Nova tarefa"
        onKeyDown={(e) => {
          const target = e.target as HTMLTextAreaElement;
          if (e.key === "Enter" && target.value) {
            handleCreateTodo(target.value);
            target.value = "";
          }
        }}
      />
      <h1>Lista de Tarefas</h1>
      <ul>
        {todos.map((todo: Todo) => (
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

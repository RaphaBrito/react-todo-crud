import "./App.css";
import { Todo } from "./types/Todo";
import { useQuery, useQueryClient, useMutation } from "react-query";

function App() {
  const queryClient = useQueryClient();
  const { data: todos } = useQuery("todos", async () => {
    const response = await fetch("http://localhost:5000/todos");
    if (!response.ok) {
      throw new Error("Erro ao carregar os dados da lista de tarefas");
    }

    return response.json();
  });

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
        throw new Error("Erro ao criar a nova tarefa");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const handleCreateTodo = (newTodo: string) => {
    createTodoMutation.mutate(newTodo);
  };

  const updateTodoMutation = useMutation(
    async (todo: Todo) => {
      const response = await fetch(`http://localhost:5000/todos/${todo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar a tarefa");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const handleUpdateTodo = (todo: Todo) => {
    updateTodoMutation.mutate(todo);
  };

  const deleteTodoMutation = useMutation(
    async (id: number) => {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Erro ao deletar a tarefa");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );
  const handleDeleteTodo = (id: number) => {
    deleteTodoMutation.mutate(id);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nova Tarefa"
        onKeyDown={(e) => {
          const target = e.target as HTMLTextAreaElement;
          if (e.key === "Enter" && target.value) {
            handleCreateTodo(target.value);
            target.value = "";
          }
        }}
      />
      <h1>Lista de Tarefas:</h1>
      <ul>
        {todos?.map((todo: Todo) => (
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

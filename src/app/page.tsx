"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch("http://localhost:5000/todo");
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async () => {
    await fetch("http://localhost:5000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title:newTodo, completed: false }),
    });
    setNewTodo("");
    fetchTodos();
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((todo) => todo._id === id);
    await fetch(`http://localhost:5000/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo?.completed }),
    });
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`http://localhost:5000/todo/${id}`, {
      method: "DELETE",
    });
    fetchTodos();
  };
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex gap-2 mb-4">
        <Input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
        />
        <Button onClick={addTodo}>Add</Button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center justify-between p-2 border rounded"
          >
            <span className={todo.completed ? "line-through":""}>{todo.title}</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toggleTodo(todo._id)}>
                {todo.completed ? "Undo" : "Complete"}
              </Button>
              <Button variant={"destructive"} onClick={() => deleteTodo(todo._id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

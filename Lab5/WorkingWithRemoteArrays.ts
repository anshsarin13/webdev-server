import type { Express, Request, Response } from "express";

type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

let todos: Todo[] = [
  { id: 1, title: "Task 1", description: "Description 1", completed: false },
  { id: 2, title: "Task 2", description: "Description 2", completed: true },
  { id: 3, title: "Task 3", description: "Description 3", completed: false },
  { id: 4, title: "Task 4", description: "Description 4", completed: true },
];

export default function WorkingWithRemoteArrays(app: Express) {
  // Retrieving arrays, optionally filtered with ?completed=true|false
  const getTodos = (req: Request, res: Response) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const wanted = completed === "true";
      res.json(todos.filter((t) => t.completed === wanted));
      return;
    }
    res.json(todos);
  };
  // Create (GET version, used by a link)
  const createNewTodo = (req: Request, res: Response) => {
    const newTodo: Todo = {
      id: new Date().getTime(),
      title: "New Task",
      description: "",
      completed: false,
    };
    todos.push(newTodo);
    res.json(todos);
  };
  // Retrieve one by primary key
  const getTodoById = (req: Request, res: Response) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id as string));
    if (!todo) {
      res.status(404).json({ message: `Unable to find Todo with ID ${id}` });
      return;
    }
    res.json(todo);
  };
  // Delete (GET version)
  const removeTodo = (req: Request, res: Response) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id as string));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.json(todos);
  };
  // Update by path (GET versions)
  const updateTodoTitle = (req: Request, res: Response) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id as string));
    if (!todo) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    todo.title = title as string;
    res.json(todos);
  };
  // On your own: completed and description
  const updateTodoCompleted = (req: Request, res: Response) => {
    const { id, completed } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id as string));
    if (!todo) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    todo.completed = completed === "true";
    res.json(todos);
  };
  const updateTodoDescription = (req: Request, res: Response) => {
    const { id, description } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id as string));
    if (!todo) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    todo.description = description as string;
    res.json(todos);
  };
  // POST, DELETE, PUT with JSON bodies
  const postNewTodo = (req: Request, res: Response) => {
    const newTodo: Todo = {
      description: "",
      completed: false,
      title: "New Task",
      ...req.body,
      id: new Date().getTime(),
    };
    todos.push(newTodo);
    res.json(newTodo);
  };
  const deleteTodo = (req: Request, res: Response) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id as string));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  };
  const updateTodo = (req: Request, res: Response) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id as string));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }
    todos = todos.map((t) =>
      t.id === parseInt(id as string) ? { ...t, ...req.body, id: t.id } : t,
    );
    res.sendStatus(200);
  };

  // Order matters: specific routes before /:id
  app.get("/lab5/todos/create", createNewTodo);
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
  app.get("/lab5/todos/:id/completed/:completed", updateTodoCompleted);
  app.get("/lab5/todos/:id/description/:description", updateTodoDescription);
  app.get("/lab5/todos/:id", getTodoById);
  app.get("/lab5/todos", getTodos);
  app.post("/lab5/todos", postNewTodo);
  app.delete("/lab5/todos/:id", deleteTodo);
  app.put("/lab5/todos/:id", updateTodo);
}

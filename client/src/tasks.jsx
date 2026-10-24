// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from './api';

export const CATEGORIES = ["Personal", "Work", "Study", "Shopping", "Other"];
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

const Tasks = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [newCategory, setNewCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  const loadTodos = async () => {
    const res = await fetch(API + "/getall");
    setTodos(await res.json());
  }

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (title.trim() === "") return;

    await fetch(API + "/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, priority: priority, dueDate: dueDate, category: newCategory })
    });

    setTitle("");
    setPriority("Medium");
    setDueDate("");
    loadTodos();
  }

  const toggleTodo = async (todo) => {
    await fetch(API + "/update/" + todo._id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done })
    });

    loadTodos();
  }

  const deleteTodo = async (id) => {
    await fetch(API + "/delete/" + id, { method: "DELETE" });
    loadTodos();
  }

  const clearCompleted = async () => {
    if (!window.confirm("Delete all completed tasks?")) return;
    await fetch(API + "/deleteCompleted", { method: "DELETE" });
    loadTodos();
  }

  const changeCategory = (value) => {
    if (value === "All") setSearchParams({});
    else setSearchParams({ category: value });
  }

  const shown = todos
    .filter((todo) => filter === "All" || (filter === "Done" ? todo.done : !todo.done))
    .filter((todo) => category === "All" || (todo.category || "Personal") === category)
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "Priority") return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (sortBy === "Due date") return (a.dueDate || "9999") > (b.dueDate || "9999") ? 1 : -1;
      return 0;
    });

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <h1>Tasks</h1>
      <p className="muted">{todos.filter((todo) => !todo.done).length} task(s) left</p>

      <form className="add-form" onSubmit={addTodo}>
        <input className="grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" />
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <div className="toolbar">
        <div className="tabs">
          {["All", "Pending", "Done"].map((f) => (
            <button key={f} className={filter === f ? "" : "outline"} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <input className="grow" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
      </div>

      <div className="toolbar">
        <div className="row">
          <select value={category} onChange={(e) => changeCategory(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option>Newest</option>
            <option>Due date</option>
            <option>Priority</option>
          </select>
        </div>
        <button className="outline" onClick={clearCompleted}>Clear completed</button>
      </div>

      <ul>
        {shown.map((todo) => (
          <li key={todo._id}>
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo)} />
            <Link to={"/task/" + todo._id} className={"task-link " + (todo.done ? "done" : "")}>{todo.title}</Link>
            <small className="tag">{todo.category || "Personal"}</small>
            {todo.dueDate && <small className={!todo.done && todo.dueDate < today ? "overdue" : "muted"}>{todo.dueDate}</small>}
            <span className={"badge " + todo.priority}>{todo.priority}</span>
            <button className="outline" onClick={() => deleteTodo(todo._id)}>✕</button>
          </li>
        ))}
      </ul>

      {shown.length === 0 && <p className="empty">No tasks here.</p>}
    </>
  )
}

export default Tasks;

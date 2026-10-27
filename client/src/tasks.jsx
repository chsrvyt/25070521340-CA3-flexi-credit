// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { request, todayString } from './api';

export const CATEGORIES = ["Personal", "Work", "Study", "Shopping", "Other"];
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

const Tasks = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";

  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [newCategory, setNewCategory] = useState("Personal");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Newest");

  const loadTodos = async () => {
    try {
      setTodos(await request("/getall"));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  // sends a change to the server and reloads the list, returns false if it failed
  const save = async (path, method, body) => {
    try {
      await request(path, method, body);
    } catch (err) {
      setError(err.message);
      return false;
    }

    await loadTodos();
    return true;
  }

  const addTodo = async (e) => {
    e.preventDefault();
    if (title.trim() === "") return;

    const added = await save("/create", "POST", { title: title, priority: priority, dueDate: dueDate, category: newCategory });

    if (added) {
      setTitle("");
      setPriority("Medium");
      setDueDate("");
    }
  }

  const toggleTodo = async (todo) => {
    // tick the box straight away instead of waiting for the server, and undo it if the save fails
    setTodos(todos.map((t) => t._id === todo._id ? { ...t, done: !t.done } : t));
    if (!(await save("/update/" + todo._id, "PUT", { done: !todo.done }))) setTodos(todos);
  }

  const deleteTodo = (id) => save("/delete/" + id, "DELETE");

  const clearCompleted = () => {
    if (!window.confirm("Delete all completed tasks?")) return;
    save("/deleteCompleted", "DELETE");
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
      if (sortBy === "Due date") return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
      return 0;
    });

  const today = todayString();

  return (
    <>
      <h1>Tasks</h1>
      <p className="muted">{todos.filter((todo) => !todo.done).length} task(s) left</p>

      {error && <p className="alert">{error}</p>}

      <form className="add-form" onSubmit={addTodo}>
        <input className="grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" aria-label="New task" />
        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} aria-label="Category">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} aria-label="Due date" />
        <button type="submit">Add</button>
      </form>

      <div className="toolbar">
        <div className="tabs">
          {["All", "Pending", "Done"].map((f) => (
            <button key={f} className={filter === f ? "" : "outline"} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <input className="grow" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." aria-label="Search tasks" />
      </div>

      <div className="toolbar">
        <div className="row">
          <select value={category} onChange={(e) => changeCategory(e.target.value)} aria-label="Show category">
            <option>All</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort by">
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
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo)} aria-label={"Mark " + todo.title + " as done"} />
            <Link to={"/task/" + todo._id} className={"task-link " + (todo.done ? "done" : "")}>{todo.title}</Link>
            <small className="tag">{todo.category || "Personal"}</small>
            {todo.dueDate && <small className={!todo.done && todo.dueDate < today ? "overdue" : "muted"}>{todo.dueDate}</small>}
            <span className={"badge " + todo.priority}>{todo.priority}</span>
            <button className="outline" onClick={() => deleteTodo(todo._id)} aria-label={"Delete " + todo.title} title="Delete">✕</button>
          </li>
        ))}
      </ul>

      {shown.length === 0 && !error && <p className="empty">{todos.length === 0 ? "No tasks yet. Add one above." : "No tasks match these filters."}</p>}
    </>
  )
}

export default Tasks;

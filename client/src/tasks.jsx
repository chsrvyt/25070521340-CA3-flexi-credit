import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from './api';

const Tasks = () => {

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

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
      body: JSON.stringify({ title: title, priority: priority, dueDate: dueDate })
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

  const shown = todos
    .filter((todo) => filter === "All" || (filter === "Done" ? todo.done : !todo.done))
    .filter((todo) => todo.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <h1>Tasks</h1>
      <p className="muted">{todos.filter((todo) => !todo.done).length} task(s) left</p>

      <form className="add-form" onSubmit={addTodo}>
        <input className="grow" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" />
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
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
      </div>

      <ul>
        {shown.map((todo) => (
          <li key={todo._id}>
            <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo)} />
            <Link to={"/task/" + todo._id} className={"task-link " + (todo.done ? "done" : "")}>{todo.title}</Link>
            {todo.dueDate && <small className="muted">{todo.dueDate}</small>}
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

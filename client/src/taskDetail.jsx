// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { request } from './api';
import { CATEGORIES } from './tasks';

const TaskDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    request("/get/" + id)
      .then((data) => setTodo({ title: "", priority: "Medium", dueDate: "", notes: "", category: "Personal", ...data }))
      .catch((err) => err.status === 404 ? setNotFound(true) : setError(err.message));
  }, [id]);

  const change = (field, value) => {
    setTodo({ ...todo, [field]: value });
    setSaved("");
  }

  const saveTodo = async (e) => {
    e.preventDefault();

    if (todo.title.trim() === "") {
      setSaved("Title can't be empty");
      return;
    }

    try {
      await request("/update/" + id, "PUT", {
        title: todo.title,
        priority: todo.priority,
        dueDate: todo.dueDate,
        notes: todo.notes,
        category: todo.category,
        done: todo.done
      });
      setSaved("Saved!");
    } catch (err) {
      setSaved(err.message);
    }
  }

  const deleteTodo = async () => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await request("/delete/" + id, "DELETE");
      navigate("/tasks");
    } catch (err) {
      setSaved(err.message);
    }
  }

  if (notFound) return <p className="empty">Task not found. <Link to="/tasks">Back to tasks</Link></p>;
  if (error) return <p className="alert">{error}</p>;
  if (todo === null) return <p className="empty">Loading...</p>;

  return (
    <>
      <Link to="/tasks" className="back">← Back to tasks</Link>
      <h1>Edit Task</h1>
      {todo.createdAt && <p className="muted">Created {new Date(todo.createdAt).toLocaleString()}</p>}

      <form className="stack-form" onSubmit={saveTodo}>
        <label htmlFor="title">Title</label>
        <input id="title" value={todo.title} onChange={(e) => change("title", e.target.value)} />

        <label htmlFor="priority">Priority</label>
        <select id="priority" value={todo.priority} onChange={(e) => change("priority", e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label htmlFor="category">Category</label>
        <select id="category" value={todo.category} onChange={(e) => change("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>

        <label htmlFor="dueDate">Due date</label>
        <input id="dueDate" type="date" value={todo.dueDate} onChange={(e) => change("dueDate", e.target.value)} />

        <label htmlFor="notes">Notes</label>
        <textarea id="notes" rows="4" value={todo.notes} onChange={(e) => change("notes", e.target.value)} placeholder="Add some notes..." />

        <label className="check">
          <input type="checkbox" checked={todo.done} onChange={(e) => change("done", e.target.checked)} />
          Mark as done
        </label>

        <div className="row">
          <button type="submit">Save</button>
          <button type="button" className="outline" onClick={deleteTodo}>Delete task</button>
          <span className="status" role="status">{saved}</span>
        </div>
      </form>
    </>
  )
}

export default TaskDetail;

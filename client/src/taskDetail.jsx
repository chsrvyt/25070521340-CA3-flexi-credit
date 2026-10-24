import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from './api';

const TaskDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch(API + "/get/" + id)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setTodo({ priority: "Medium", dueDate: "", notes: "", ...data }))
      .catch(() => setNotFound(true));
  }, [id]);

  const change = (field, value) => {
    setTodo({ ...todo, [field]: value });
    setSaved("");
  }

  const saveTodo = async (e) => {
    e.preventDefault();

    await fetch(API + "/update/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        priority: todo.priority,
        dueDate: todo.dueDate,
        notes: todo.notes,
        done: todo.done
      })
    });

    setSaved("Saved!");
  }

  const deleteTodo = async () => {
    await fetch(API + "/delete/" + id, { method: "DELETE" });
    navigate("/tasks");
  }

  if (notFound) return <p className="empty">Task not found. <Link to="/tasks">Back to tasks</Link></p>;
  if (todo === null) return <p className="empty">Loading...</p>;

  return (
    <>
      <Link to="/tasks" className="back">← Back to tasks</Link>
      <h1>Edit Task</h1>
      {todo.createdAt && <p className="muted">Created {new Date(todo.createdAt).toLocaleString()}</p>}

      <form className="stack-form" onSubmit={saveTodo}>
        <label>Title</label>
        <input value={todo.title} onChange={(e) => change("title", e.target.value)} />

        <label>Priority</label>
        <select value={todo.priority} onChange={(e) => change("priority", e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label>Due date</label>
        <input type="date" value={todo.dueDate} onChange={(e) => change("dueDate", e.target.value)} />

        <label>Notes</label>
        <textarea rows="4" value={todo.notes} onChange={(e) => change("notes", e.target.value)} placeholder="Add some notes..." />

        <label className="check">
          <input type="checkbox" checked={todo.done} onChange={(e) => change("done", e.target.checked)} />
          Mark as done
        </label>

        <div className="row">
          <button type="submit">Save</button>
          <button type="button" className="outline" onClick={deleteTodo}>Delete task</button>
          <span className="status">{saved}</span>
        </div>
      </form>
    </>
  )
}

export default TaskDetail;

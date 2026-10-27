// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request, todayString } from './api';
import { useAuth } from './auth';

const Dashboard = () => {

  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/getall")
      .then((data) => setTodos(data))
      .catch((err) => setError(err.message));
  }, []);

  const total = todos.length;
  const done = todos.filter((todo) => todo.done).length;
  const pending = total - done;
  const high = todos.filter((todo) => !todo.done && todo.priority === "High").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const today = todayString();
  const dueToday = todos.filter((todo) => !todo.done && todo.dueDate === today);
  const overdue = todos.filter((todo) => !todo.done && todo.dueDate && todo.dueDate < today).length;

  return (
    <>
      <h1>Dashboard</h1>
      <p className="muted">Hi {user.name} · {new Date().toDateString()}</p>

      {error && <p className="alert">{error}</p>}

      <div className="stats">
        <div className="stat"><b>{total}</b><span>Total</span></div>
        <div className="stat"><b>{pending}</b><span>Pending</span></div>
        <div className="stat"><b>{done}</b><span>Done</span></div>
        <div className="stat"><b>{high}</b><span>High priority</span></div>
      </div>

      <h3>Progress — {percent}%</h3>
      <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" aria-label="Tasks done">
        <div className="progress-fill" style={{ width: percent + "%" }}></div>
      </div>

      {overdue > 0 && <p className="alert">⚠ You have {overdue} overdue task(s). <Link to="/upcoming">View</Link></p>}

      <h3>Due today</h3>
      {dueToday.length === 0 && <p className="empty">Nothing due today.</p>}
      <ul>
        {dueToday.map((todo) => (
          <li key={todo._id}>
            <Link to={"/task/" + todo._id} className="task-link">{todo.title}</Link>
            <span className={"badge " + todo.priority}>{todo.priority}</span>
          </li>
        ))}
      </ul>

      <div className="row">
        <Link to="/tasks" className="button">Go to tasks →</Link>
        <Link to="/notes" className="button outline">Open notes</Link>
      </div>
    </>
  )
}

export default Dashboard;

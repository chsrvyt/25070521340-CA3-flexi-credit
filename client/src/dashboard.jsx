import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from './api';

const Dashboard = () => {

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(API + "/getall")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(() => setTodos([]));
  }, []);

  const total = todos.length;
  const done = todos.filter((todo) => todo.done).length;
  const pending = total - done;
  const high = todos.filter((todo) => !todo.done && todo.priority === "High").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const today = new Date().toISOString().slice(0, 10);
  const dueToday = todos.filter((todo) => !todo.done && todo.dueDate === today);

  return (
    <>
      <h1>Dashboard</h1>
      <p className="muted">{new Date().toDateString()}</p>

      <div className="stats">
        <div className="stat"><b>{total}</b><span>Total</span></div>
        <div className="stat"><b>{pending}</b><span>Pending</span></div>
        <div className="stat"><b>{done}</b><span>Done</span></div>
        <div className="stat"><b>{high}</b><span>High priority</span></div>
      </div>

      <h3>Progress — {percent}%</h3>
      <div className="progress">
        <div className="progress-fill" style={{ width: percent + "%" }}></div>
      </div>

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

      <Link to="/tasks"><button>Go to tasks →</button></Link>
    </>
  )
}

export default Dashboard;

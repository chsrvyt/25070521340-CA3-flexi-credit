// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request, todayString } from './api';

const Upcoming = () => {

  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/getall")
      .then((data) => setTodos(data.filter((todo) => !todo.done)))
      .catch((err) => setError(err.message));
  }, []);

  const today = todayString();

  const groups = [
    { name: "Overdue", list: todos.filter((todo) => todo.dueDate && todo.dueDate < today) },
    { name: "Today", list: todos.filter((todo) => todo.dueDate === today) },
    { name: "Upcoming", list: todos.filter((todo) => todo.dueDate > today).sort((a, b) => a.dueDate.localeCompare(b.dueDate)) },
    { name: "No due date", list: todos.filter((todo) => !todo.dueDate) }
  ];

  return (
    <>
      <h1>Upcoming</h1>
      <p className="muted">Pending tasks by due date</p>

      {error && <p className="alert">{error}</p>}

      {groups.map((group) => (
        <div key={group.name}>
          <h3>{group.name} ({group.list.length})</h3>
          {group.list.length === 0 && <p className="empty small">Nothing here.</p>}
          <ul>
            {group.list.map((todo) => (
              <li key={todo._id}>
                <Link to={"/task/" + todo._id} className="task-link">{todo.title}</Link>
                {todo.dueDate && <small className={group.name === "Overdue" ? "overdue" : "muted"}>{todo.dueDate}</small>}
                <span className={"badge " + todo.priority}>{todo.priority}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

export default Upcoming;

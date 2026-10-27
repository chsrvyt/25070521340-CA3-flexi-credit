// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { request } from './api';
import { CATEGORIES } from './tasks';

const Categories = () => {

  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/getall")
      .then((data) => setTodos(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <>
      <h1>Categories</h1>
      <p className="muted">Click a category to see its tasks</p>

      {error && <p className="alert">{error}</p>}

      <div className="cat-grid">
        {CATEGORIES.map((c) => {
          const list = todos.filter((todo) => (todo.category || "Personal") === c);
          const done = list.filter((todo) => todo.done).length;
          const percent = list.length === 0 ? 0 : Math.round((done / list.length) * 100);

          return (
            <Link to={"/tasks?category=" + c} className="cat-card" key={c}>
              <b>{c}</b>
              <span>{list.length} task(s) · {done} done</span>
              <div className="progress">
                <div className="progress-fill" style={{ width: percent + "%" }}></div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Categories;

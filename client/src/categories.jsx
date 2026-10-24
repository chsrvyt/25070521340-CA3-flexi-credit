// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from './api';
import { CATEGORIES } from './tasks';

const Categories = () => {

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch(API + "/getall")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch(() => setTodos([]));
  }, []);

  return (
    <>
      <h1>Categories</h1>
      <p className="muted">Click a category to see its tasks</p>

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

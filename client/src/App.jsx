import { Routes, Route } from 'react-router-dom';
import Nav from './nav';
import Dashboard from './dashboard';
import Tasks from './tasks';
import TaskDetail from './taskDetail';
import Messages from './messages';
import About from './about';
import Contact from './contact';
import NotFound from './notFound';
import './App.css';

const App = () => {

  return (
    <>
      <Nav/>

      <div className="page">
        <Routes>
          <Route path="/" element={<Dashboard/>}></Route>
          <Route path="/tasks" element={<Tasks/>}></Route>
          <Route path="/task/:id" element={<TaskDetail/>}></Route>
          <Route path="/messages" element={<Messages/>}></Route>
          <Route path="/about" element={<About/>}></Route>
          <Route path="/contact" element={<Contact/>}></Route>
          <Route path="*" element={<NotFound/>}></Route>
        </Routes>
      </div>

      <footer className="footer">My Todos · React + Node.js + MongoDB</footer>
    </>
  )
}

export default App;

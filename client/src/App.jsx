// Made by SARVESH CHONDE

import { Routes, Route } from 'react-router-dom';
import Nav from './nav';
import Dashboard from './dashboard';
import Tasks from './tasks';
import TaskDetail from './taskDetail';
import Upcoming from './upcoming';
import Categories from './categories';
import Notes from './notes';
import Messages from './messages';
import About from './about';
import Contact from './contact';
import NotFound from './notFound';
import './App.css';

const App = () => {

  return (
    <div className="layout">
      <Nav/>

      <main className="main">
        <div className="page">
          <Routes>
            <Route path="/" element={<Dashboard/>}></Route>
            <Route path="/tasks" element={<Tasks/>}></Route>
            <Route path="/task/:id" element={<TaskDetail/>}></Route>
            <Route path="/upcoming" element={<Upcoming/>}></Route>
            <Route path="/categories" element={<Categories/>}></Route>
            <Route path="/notes" element={<Notes/>}></Route>
            <Route path="/messages" element={<Messages/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/contact" element={<Contact/>}></Route>
            <Route path="*" element={<NotFound/>}></Route>
          </Routes>
        </div>

        <footer className="footer">Made by <b>SARVESH CHONDE</b></footer>
      </main>
    </div>
  )
}

export default App;

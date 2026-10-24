// Made by SARVESH CHONDE

import { NavLink } from 'react-router-dom';

const Nav = () => {

    return (
        <aside className="sidebar">
            <div className="logo">✓ My Todos</div>

            <nav className="side-links">
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/tasks">Tasks</NavLink>
                <NavLink to="/upcoming">Upcoming</NavLink>
                <NavLink to="/categories">Categories</NavLink>
                <NavLink to="/notes">Notes</NavLink>
                <NavLink to="/messages">Messages</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
            </nav>

            <div className="side-footer">Made by <b>SARVESH CHONDE</b></div>
        </aside>
    )
}

export default Nav;

import { NavLink } from 'react-router-dom';

const Nav = () => {

    return (
        <nav className="my-nav">
            <span className="logo">✓ My Todos</span>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
            <NavLink to="/messages">Messages</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
        </nav>
    )
}

export default Nav;

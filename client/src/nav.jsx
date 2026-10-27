// Made by SARVESH CHONDE

import { NavLink } from 'react-router-dom';
import { useAuth } from './auth';

const Nav = () => {

    const { user, logout } = useAuth();

    return (
        <aside className="sidebar">
            <div className="logo">✓ My Todos</div>

            <nav className="side-links">
                {user && (
                    <>
                        <NavLink to="/" end>Dashboard</NavLink>
                        <NavLink to="/tasks">Tasks</NavLink>
                        <NavLink to="/upcoming">Upcoming</NavLink>
                        <NavLink to="/categories">Categories</NavLink>
                        <NavLink to="/notes">Notes</NavLink>
                        <NavLink to="/messages">Messages</NavLink>
                    </>
                )}
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
                {!user && (
                    <>
                        <NavLink to="/login">Log in</NavLink>
                        <NavLink to="/signup">Sign up</NavLink>
                    </>
                )}
            </nav>

            {user && (
                <div className="side-user">
                    Logged in as
                    <b>{user.name}</b>
                    <button onClick={logout}>Log out</button>
                </div>
            )}

            <div className="side-footer">Made by <b>SARVESH CHONDE</b></div>
        </aside>
    )
}

export default Nav;

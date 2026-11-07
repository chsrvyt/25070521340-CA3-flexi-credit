// Made by SARVESH CHONDE

import { NavLink } from 'react-router-dom';
import { useAuth } from './auth';
import Icon from './icons';

const Nav = () => {

    const { user, logout } = useAuth();

    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-mark"><Icon name="check" size={18} /></span>
                My Todos
            </div>

            <nav className="side-links">
                {user && (
                    <>
                        <NavLink to="/" end><Icon name="dashboard" />Dashboard</NavLink>
                        <NavLink to="/tasks"><Icon name="tasks" />Tasks</NavLink>
                        <NavLink to="/upcoming"><Icon name="upcoming" />Upcoming</NavLink>
                        <NavLink to="/categories"><Icon name="categories" />Categories</NavLink>
                        <NavLink to="/notes"><Icon name="notes" />Notes</NavLink>
                        <NavLink to="/messages"><Icon name="messages" />Messages</NavLink>
                    </>
                )}
                <NavLink to="/about"><Icon name="about" />About</NavLink>
                <NavLink to="/contact"><Icon name="contact" />Contact</NavLink>
                {!user && (
                    <>
                        <NavLink to="/login"><Icon name="login" />Log in</NavLink>
                        <NavLink to="/signup"><Icon name="signup" />Sign up</NavLink>
                    </>
                )}
            </nav>

            {user && (
                <div className="side-user">
                    <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                    <div className="who">
                        <b>{user.name}</b>
                        <small>{user.email}</small>
                    </div>
                    <button onClick={logout}><Icon name="logout" size={16} />Log out</button>
                </div>
            )}

            <div className="side-footer">Made by <b>SARVESH CHONDE</b></div>
        </aside>
    )
}

export default Nav;

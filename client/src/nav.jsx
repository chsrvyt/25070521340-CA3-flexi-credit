import { NavLink } from 'react-router-dom';

const Nav = () => {

    return (
        <aside className="sidebar">
            <div className="logo">✓ My Todos</div>

            <nav className="side-links">
                <NavLink to="/" end>🏠 Dashboard</NavLink>
                <NavLink to="/tasks">📝 Tasks</NavLink>
                <NavLink to="/messages">💬 Messages</NavLink>
                <NavLink to="/about">ℹ️ About</NavLink>
                <NavLink to="/contact">✉️ Contact</NavLink>
            </nav>

            <div className="side-footer">React + Node.js + MongoDB</div>
        </aside>
    )
}

export default Nav;

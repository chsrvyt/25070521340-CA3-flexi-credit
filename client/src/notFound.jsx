// Made by SARVESH CHONDE

import { Link } from 'react-router-dom';

const NotFound = () => {

    return (
        <div className="empty">
            <h1>404</h1>
            <p>This page does not exist.</p>
            <Link to="/" className="button">Go home</Link>
        </div>
    )
}

export default NotFound;

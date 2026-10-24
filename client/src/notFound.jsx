import { Link } from 'react-router-dom';

const NotFound = () => {

    return (
        <div className="empty">
            <h1>404</h1>
            <p>This page does not exist.</p>
            <Link to="/"><button>Go home</button></Link>
        </div>
    )
}

export default NotFound;

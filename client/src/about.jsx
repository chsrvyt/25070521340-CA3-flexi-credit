const About = () => {

    return (
        <>
            <h1>About</h1>
            <p className="muted">A simple to do list app.</p>

            <h3>Features</h3>
            <ul className="plain">
                <li>Add tasks with priority and due date</li>
                <li>Filter and search tasks</li>
                <li>Edit task details and notes</li>
                <li>Dashboard with progress</li>
                <li>Contact form saved to the database</li>
            </ul>

            <h3>Built with</h3>
            <ul className="plain">
                <li>Client — React</li>
                <li>Server — Node.js (Express)</li>
                <li>Database — MongoDB</li>
            </ul>
        </>
    )
}

export default About;

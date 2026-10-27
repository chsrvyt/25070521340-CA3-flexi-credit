// Made by SARVESH CHONDE

const About = () => {

    return (
        <>
            <h1>About</h1>
            <p className="muted">A simple to do list app.</p>

            <h3>Features</h3>
            <ul className="plain">
                <li>Sign up and log in, every user has their own tasks and notes</li>
                <li>Add tasks with category, priority and due date</li>
                <li>Filter, search and sort tasks</li>
                <li>Upcoming view grouped by due date</li>
                <li>Categories with progress</li>
                <li>Notes you can add, edit and delete</li>
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

            <h3>Developer</h3>
            <p>Made by <b>SARVESH CHONDE</b></p>
        </>
    )
}

export default About;

import { useState } from 'react';
import API from './api';

const Contact = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();
        if (name.trim() === "" || email.trim() === "" || message.trim() === "") {
            setStatus("Please fill all fields");
            return;
        }

        await fetch(API + "/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, email: email, message: message })
        });

        setName("");
        setEmail("");
        setMessage("");
        setStatus("Message sent!");
    }

    return (
        <>
            <h1>Contact</h1>
            <p className="muted">Send us a message.</p>

            <form className="contact-form" onSubmit={sendMessage}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" rows="4" />
                <button type="submit">Send</button>
            </form>

            <p className="status">{status}</p>
        </>
    )
}

export default Contact;

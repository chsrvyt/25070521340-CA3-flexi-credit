// Made by SARVESH CHONDE

import { useState } from 'react';
import { request } from './api';

const Contact = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [sending, setSending] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (name.trim() === "" || email.trim() === "" || message.trim() === "") {
            setStatus("Please fill all fields");
            return;
        }

        setSending(true);

        try {
            await request("/contact", "POST", { name: name, email: email, message: message });

            setName("");
            setEmail("");
            setMessage("");
            setStatus("Message sent!");
        } catch (err) {
            setStatus(err.message);
        }

        setSending(false);
    }

    return (
        <>
            <h1>Contact</h1>
            <p className="muted">Send us a message.</p>

            <form className="contact-form" onSubmit={sendMessage}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Name" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" aria-label="Email" />
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" rows="4" aria-label="Message" />
                <button type="submit" disabled={sending}>{sending ? "Sending..." : "Send"}</button>
            </form>

            <p className="status" role="status">{status}</p>
        </>
    )
}

export default Contact;

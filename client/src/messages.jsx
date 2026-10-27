// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { request } from './api';

const Messages = () => {

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setMessages(await request("/messages"));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const deleteMessage = async (id) => {
    try {
      await request("/messages/" + id, "DELETE");
    } catch (err) {
      setError(err.message);
      return;
    }

    loadMessages();
  }

  return (
    <>
      <h1>Messages</h1>
      <p className="muted">{messages.length} message(s) from the contact page</p>

      {error && <p className="alert">{error}</p>}

      {messages.map((msg) => (
        <div className="message" key={msg._id}>
          <div className="row">
            <b>{msg.name}</b>
            <small className="muted grow">{msg.email}</small>
            {msg.createdAt && <small className="muted">{new Date(msg.createdAt).toLocaleString()}</small>}
            <button className="outline" onClick={() => deleteMessage(msg._id)} aria-label={"Delete message from " + msg.name} title="Delete">✕</button>
          </div>
          <p>{msg.message}</p>
        </div>
      ))}

      {messages.length === 0 && !error && <p className="empty">No messages yet.</p>}
    </>
  )
}

export default Messages;

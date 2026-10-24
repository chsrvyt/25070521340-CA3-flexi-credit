import { useEffect, useState } from 'react';
import API from './api';

const Messages = () => {

  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    const res = await fetch(API + "/messages");
    setMessages(await res.json());
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const deleteMessage = async (id) => {
    await fetch(API + "/messages/" + id, { method: "DELETE" });
    loadMessages();
  }

  return (
    <>
      <h1>Messages</h1>
      <p className="muted">{messages.length} message(s) from the contact page</p>

      {messages.map((msg) => (
        <div className="message" key={msg._id}>
          <div className="row">
            <b>{msg.name}</b>
            <small className="muted grow">{msg.email}</small>
            <button className="outline" onClick={() => deleteMessage(msg._id)}>✕</button>
          </div>
          <p>{msg.message}</p>
        </div>
      ))}

      {messages.length === 0 && <p className="empty">No messages yet.</p>}
    </>
  )
}

export default Messages;

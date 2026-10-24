// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import API from './api';

const Notes = () => {

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  const loadNotes = async () => {
    const res = await fetch(API + "/notes");
    setNotes(await res.json());
  }

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNote = async (e) => {
    e.preventDefault();
    if (title.trim() === "") return;

    await fetch(API + "/notes" + (editId ? "/" + editId : ""), {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, text: text })
    });

    setTitle("");
    setText("");
    setEditId(null);
    loadNotes();
  }

  const editNote = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setText(note.text);
  }

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setText("");
  }

  const deleteNote = async (id) => {
    await fetch(API + "/notes/" + id, { method: "DELETE" });
    loadNotes();
  }

  return (
    <>
      <h1>Notes</h1>
      <p className="muted">{notes.length} note(s)</p>

      <form className="stack-form" onSubmit={saveNote}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" />
        <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write something..." />
        <div className="row">
          <button type="submit">{editId ? "Update note" : "Add note"}</button>
          {editId && <button type="button" className="outline" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <div className="note-grid">
        {notes.map((note) => (
          <div className="note" key={note._id}>
            <b>{note.title}</b>
            <p>{note.text}</p>
            <div className="row">
              <button className="outline" onClick={() => editNote(note)}>Edit</button>
              <button className="outline" onClick={() => deleteNote(note._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && <p className="empty">No notes yet.</p>}
    </>
  )
}

export default Notes;

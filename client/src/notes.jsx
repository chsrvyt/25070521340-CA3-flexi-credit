// Made by SARVESH CHONDE

import { useEffect, useState } from 'react';
import { request } from './api';

const Notes = () => {

  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);

  const loadNotes = async () => {
    try {
      setNotes(await request("/notes"));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  const saveNote = async (e) => {
    e.preventDefault();
    if (title.trim() === "") return;

    try {
      await request("/notes" + (editId ? "/" + editId : ""), editId ? "PUT" : "POST", { title: title, text: text });
    } catch (err) {
      setError(err.message);
      return;
    }

    setTitle("");
    setText("");
    setEditId(null);
    loadNotes();
  }

  const editNote = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setText(note.text || "");
  }

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setText("");
  }

  const deleteNote = async (note) => {
    if (!window.confirm("Delete the note \"" + note.title + "\"?")) return;

    try {
      await request("/notes/" + note._id, "DELETE");
    } catch (err) {
      setError(err.message);
      return;
    }

    if (editId === note._id) cancelEdit();
    loadNotes();
  }

  return (
    <>
      <h1>Notes</h1>
      <p className="muted">{notes.length} note(s)</p>

      {error && <p className="alert">{error}</p>}

      <form className="stack-form" onSubmit={saveNote}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" aria-label="Note title" />
        <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write something..." aria-label="Note text" />
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
              <button className="outline" onClick={() => deleteNote(note)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && !error && <p className="empty">No notes yet.</p>}
    </>
  )
}

export default Notes;

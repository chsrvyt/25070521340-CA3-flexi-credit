// Made by SARVESH CHONDE

import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

const Signup = () => {

  const { user, signup } = useAuth();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  if (user) return <Navigate to={(location.state && location.state.from) || "/"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (name.trim() === "" || email.trim() === "" || password === "") {
      setStatus("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      setStatus("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setStatus("Passwords don't match");
      return;
    }

    setSending(true);

    try {
      await signup(name, email, password);
    } catch (err) {
      setStatus(err.message);
      setSending(false);
    }
  }

  return (
    <div className="auth">
      <h1>Sign up</h1>
      <p className="muted">Create an account to keep your own tasks and notes.</p>

      <form className="stack-form" onSubmit={submit}>
        <label htmlFor="name">Name</label>
        <input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />

        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />

        <div className="row">
          <button type="submit" disabled={sending}>{sending ? "Creating account..." : "Sign up"}</button>
          <span className="status" role="status">{status}</span>
        </div>
      </form>

      <p>Already have an account? <Link to="/login" state={location.state}>Log in</Link></p>
    </div>
  )
}

export default Signup;

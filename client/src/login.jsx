// Made by SARVESH CHONDE

import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './auth';

const Login = () => {

  const { user, login } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  // once logged in, go back to the page that asked for a login
  if (user) return <Navigate to={(location.state && location.state.from) || "/"} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || password === "") {
      setStatus("Please enter your email and password");
      return;
    }

    setSending(true);

    try {
      await login(email, password);
    } catch (err) {
      setStatus(err.message);
      setSending(false);
    }
  }

  return (
    <div className="auth">
      <h1>Log in</h1>
      <p className="muted">Welcome back! Log in to see your tasks.</p>

      <form className="stack-form" onSubmit={submit}>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="row">
          <button type="submit" disabled={sending}>{sending ? "Logging in..." : "Log in"}</button>
          <span className="status" role="status">{status}</span>
        </div>
      </form>

      <p>Don't have an account? <Link to="/signup" state={location.state}>Sign up</Link></p>
    </div>
  )
}

export default Login;

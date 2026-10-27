// Made by SARVESH CHONDE

import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { request } from './api';

const AuthContext = createContext(null);

// the user saved by the last login, so the app doesn't flash the login page on reload
const savedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(savedUser);

  const saveLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const login = async (email, password) => {
    saveLogin(await request("/login", "POST", { email: email, password: password }));
  }

  const signup = async (name, email, password) => {
    saveLogin(await request("/signup", "POST", { name: name, email: email, password: password }));
  }

  useEffect(() => {
    // api.js fires this when the server rejects the saved token
    window.addEventListener("logout", logout);

    // check the saved login is still valid (a 401 here logs out through the event above)
    if (localStorage.getItem("token")) {
      request("/me")
        .then((data) => {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        })
        .catch(() => {});
    }

    return () => window.removeEventListener("logout", logout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);

// wraps the pages that need a login, sends everyone else to the login page
export const RequireLogin = () => {

  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;

  return <Outlet/>;
}

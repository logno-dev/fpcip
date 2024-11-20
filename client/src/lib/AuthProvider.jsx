import { useEffect, useState } from "react";
import { checkCookie, signIn, signOut } from "./auth.ts";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkCookie().then((data) => {
      setIsAuthenticated(data.isAuthenticated);
      setUser(data.user);
    });
  }, []);

  function login(username, password) {
    signIn(username, password)
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
        setMessage(data.message);
      });
  }

  function logout() {
    signOut().then((data) => {
      console.log(data);
      setIsAuthenticated(data.isAuthenticated);
      setUser(data.user);
    });
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, message, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

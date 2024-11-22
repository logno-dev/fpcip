import { useEffect, useState } from "react";
import { checkCookie, signIn, signOut } from "./auth.ts";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    checkCookie().then((data) => {
      setIsAuthenticated(data.isAuthenticated);
      setUser(data.user);
      setIsLoading(false);
    });
  }, []);

  function login(username, password) {
    setIsLoading(true);
    signIn(username, password)
      .then((data) => {
        setIsAuthenticated(data.isAuthenticated);
        setUser(data.user);
        setMessage(data.message);
        setIsLoading(false);
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
      value={{ isAuthenticated, isLoading, user, message, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

import Login from "./components/Login.jsx";
import { AuthContext } from "./lib/AuthContext.js";
import { useContext } from "react";
import FpApp from "./FpApp.jsx";

export default function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <>
      {isAuthenticated
        ? (
          <>
            <FpApp />
          </>
        )
        : (
          <>
            <Login />
          </>
        )}
    </>
  );
}

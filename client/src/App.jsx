import Login from "./components/Login.jsx";
import { AuthContext } from "./lib/AuthContext.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useContext } from "react";
import FpApp from "./FpApp.jsx";
import Dump from "./Dump.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <FpApp />,
  },
  {
    path: "/dump",
    element: <Dump />,
  },
]);

export default function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  return (
    <>
      {isLoading ? <h3>Loading...</h3> : (
        <>
          {isAuthenticated ? <RouterProvider router={router} /> : <Login />}
        </>
      )}
    </>
  );
}

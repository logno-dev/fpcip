import { useContext, useState } from "react";
import { AuthContext } from "../lib/AuthContext.js";

export default function Login() {
  const { login, message } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    login(username, password);
  }

  return (
    <div className="flex flex-col h-[100dvh] place-items-center place-content-center">
      <form
        className="flex flex-col place-items-center p-4 rounded-lg bg-slate-600 gap-4"
        onSubmit={handleSubmit}
      >
        <input
          className="p-1 rounded-md"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="p-1 rounded-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="text-slate-100 border border-2 border-slate-100 hover:bg-slate-100 hover:text-slate-600 w-fit rounded-md p-1"
          type="submit"
        >
          Log In
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

import { useContext } from "react";
import { AuthContext } from "../lib/AuthContext.js";

export default function Logout() {
  const { logout } = useContext(AuthContext);

  return (
    <button
      className="border border-2 border-slate-100 text-slate-100 rounded-md p-1 hover:text-slate-600 hover:bg-slate-100 mb-14"
      type="button"
      onClick={logout}
    >
      Log Out
    </button>
  );
}

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function DashboardPage() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        Enterprise Dashboard
      </h1>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
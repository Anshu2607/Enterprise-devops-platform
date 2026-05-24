import {

  Routes,

  Route,

  Navigate,

} from "react-router-dom";

import LoginPage
  from "../pages/LoginPage";

import DashboardPage
  from "../pages/DashboardPage";

function AppRoutes() {

  const token =
    localStorage.getItem("token");

  return (

    <Routes>

      <Route

        path="/login"

        element={<LoginPage />}

      />

      <Route

        path="/dashboard"

        element={

          token

            ? <DashboardPage />

            : <Navigate to="/login" />
        }

      />

      <Route

        path="*"

        element={
          <Navigate to="/login" />
        }

      />

    </Routes>
  );
}

export default AppRoutes;
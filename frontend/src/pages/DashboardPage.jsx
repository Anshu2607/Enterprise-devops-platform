import { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api/axios";

import { AuthContext } from "../context/AuthContext";

import CreateProjectForm from "../components/CreateProjectForm";

import ProjectCard from "../components/ProjectCard";
import DeploymentLogs from "../components/DeploymentLogs";
function DashboardPage() {

  const navigate = useNavigate();

  const { logout } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {

      const response = await API.get("/projects");

      setProjects(response.data.projects);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-4xl font-bold">
          Enterprise Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded"
        >
          Logout
        </button>

      </div>

      <div className="grid md:grid-cols-2 gap-8">

        <CreateProjectForm
          fetchProjects={fetchProjects}
        />

        <div className="space-y-6">

          <h2 className="text-3xl font-bold">
            Your Projects
          </h2>

          {
            projects.length === 0
            ? (
              <p className="text-gray-400">
                No projects yet
              </p>
            )
            : (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))
            )
          }

        </div>
        <div className="mt-10">
  <DeploymentLogs />
</div>

      </div>

    </div>
  );
}

export default DashboardPage;
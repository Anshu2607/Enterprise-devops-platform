import {
  useEffect,
  useState,
} from "react";

import {
  getProjects,
} from "../services/projectService";

import {
  getDeployments,
} from "../services/deploymentService";

import ProjectCard
  from "../components/ProjectCard";

import DeploymentTable
  from "../components/DeploymentTable";

import StatsCard from "../components/StatsCard";
import DeploymentTerminal from "../components/DeploymentTerminal";
function DashboardPage() {

  const [projects, setProjects] =
    useState([]);

  const [
    deployments,
    setDeployments,
  ] = useState([]);

  const completedDeployments =
  deployments.filter(
    (d) => d.status === "completed"
  ).length;

const failedDeployments =
  deployments.filter(
    (d) => d.status === "failed"
  ).length;

const activeDeployments =
  deployments.filter(
    (d) =>

      d.status !== "completed" &&
      d.status !== "failed"

  ).length;

  useEffect(() => {

  fetchData();

  const interval = setInterval(() => {

    fetchData();

  }, 3000);

  return () => clearInterval(interval);

}, []);

  const fetchData = async () => {

    try {

      const projectData =
        await getProjects();

      setProjects(
        projectData.projects
      );

      const deploymentData =
        await getDeployments();

      setDeployments(
        deploymentData.deployments
      );

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-10">

        Enterprise DevOps Dashboard

      </h1>
      <div className="
  grid
  grid-cols-1
  md:grid-cols-3
  gap-6
  mb-10
">

  <StatsCard
    title="Projects"
    value={projects.length}
    color="bg-blue-700"
  />

  <StatsCard
    title="Completed Deployments"
    value={completedDeployments}
    color="bg-green-700"
  />

  <StatsCard
    title="Active Deployments"
    value={activeDeployments}
    color="bg-yellow-600"
  />

</div>

      {/* PROJECTS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {
          projects.map((project) => (

            <ProjectCard
              key={project.id}
              project={project}
            />
          ))
        }

      </div>

      {/* DEPLOYMENTS */}

      <DeploymentTable
        deployments={deployments}
      />
      <DeploymentTerminal
  deployments={deployments}
/>

    </div>
  );
}

export default DashboardPage;
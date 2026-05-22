function ProjectCard({ project }) {

  return (
    <div className="bg-gray-900 p-6 rounded-xl space-y-3">

      <h2 className="text-2xl font-bold">
        {project.name}
      </h2>

      <p className="text-gray-400 break-all">
        {project.repository}
      </p>

      <p className="text-sm text-gray-500">
        Created:
        {" "}
        {new Date(project.createdAt).toLocaleString()}
      </p>

    </div>
  );
}

export default ProjectCard;
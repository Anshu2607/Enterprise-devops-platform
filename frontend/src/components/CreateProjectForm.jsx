import { useState } from "react";

import API from "../api/axios";

function CreateProjectForm({ fetchProjects }) {

  const [formData, setFormData] = useState({
    name: "",
    repository: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await API.post(
        "/projects",
        formData
      );

      alert(response.data.message);

      setFormData({
        name: "",
        repository: "",
      });

      fetchProjects();

    } catch (error) {
      console.log(error);

      alert("Project creation failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded-xl space-y-4"
    >

      <h2 className="text-2xl font-bold">
        Create Project
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Project Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 rounded bg-gray-800"
      />

      <input
        type="text"
        name="repository"
        placeholder="GitHub Repository URL"
        value={formData.repository}
        onChange={handleChange}
        className="w-full p-3 rounded bg-gray-800"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded"
      >
        Create Project
      </button>

    </form>
  );
}

export default CreateProjectForm;
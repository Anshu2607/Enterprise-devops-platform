import axios from "axios";

const API =
  "http://localhost:5000/api/projects";

export const getProjects = async () => {

  const token =
    localStorage.getItem("token");

  const response = await axios.get(
    API,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
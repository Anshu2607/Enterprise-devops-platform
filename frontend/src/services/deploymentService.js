import axios from "axios";

const API =
  "http://localhost:5000/api";

const getConfig = () => {

  const token =
    localStorage.getItem("token");

  return {

    headers: {

      Authorization:
        `Bearer ${token}`,
    },
  };
};

// GET DEPLOYMENTS

export const getDeployments =
  async () => {

    const response =
      await axios.get(

        `${API}/deployments`,

        getConfig()
      );

    return response.data;
};

// STOP DEPLOYMENT

export const stopDeployment =
  async (deploymentId) => {

    const response =
      await axios.post(

        `${API}/manage/stop/${deploymentId}`,

        {},

        getConfig()
      );

    return response.data;
};

// RESTART DEPLOYMENT

export const restartDeployment =
  async (deploymentId) => {

    const response =
      await axios.post(

        `${API}/manage/restart/${deploymentId}`,

        {},

        getConfig()
      );

    return response.data;
};

// DELETE DEPLOYMENT

export const deleteDeployment =
  async (deploymentId) => {

    const response =
      await axios.delete(

        `${API}/manage/delete/${deploymentId}`,

        getConfig()
      );

    return response.data;
};
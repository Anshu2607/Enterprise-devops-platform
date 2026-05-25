import axios from "axios";

const API =
  "http://localhost:5000/api";

export const getDeployments =
  async () => {

    const response =
      await axios.get(

        `${API}/deployments`
      );

    return response.data;
};

export const deleteDeployment =
  async (id) => {

    const response =
      await axios.delete(

        `${API}/delete-deployment/${id}`
      );

    return response.data;
};

export const deployProject =
  async (data) => {

    const response =
      await axios.post(

        `${API}/deploy`,

        data
      );

    return response.data;
};
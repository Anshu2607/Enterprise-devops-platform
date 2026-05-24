import axios from "axios";

function DeploymentTable({

  deployments,

  fetchDashboardData,

}) {

  const stopDeployment =
    async (deploymentId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(

          `http://localhost:5000/api/manage/stop/${deploymentId}`,

          {},

          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        fetchDashboardData();

      } catch (error) {

        console.log(error);
      }
};

return (

<div className="
  bg-gray-900
  rounded-xl
  p-6
">

<h2 className="
  text-2xl
  font-bold
  mb-6
">

Deployments

</h2>

<div className="
  overflow-x-auto
">

<table className="
  w-full
  text-left
">

<thead>

<tr className="
  border-b
  border-gray-700
">

<th className="p-3">
Project
</th>

<th className="p-3">
Status
</th>

<th className="p-3">
URL
</th>

<th className="p-3">
Actions
</th>

</tr>

</thead>

<tbody>

{
  deployments.map(
    (deployment) => (

<tr
  key={deployment.id}
  className="
    border-b
    border-gray-800
  "
>

<td className="p-3">

{
  deployment.project?.name
}

</td>

<td className="p-3">

<span className="
  bg-green-600
  px-3
  py-1
  rounded-full
  text-sm
">

{
  deployment.status
}

</span>

</td>

<td className="p-3">

{
  deployment.deployedUrl
  ? (

<a

href={
  deployment.deployedUrl
}

target="_blank"

className="
  text-blue-400
  underline
"
>

Open App

</a>

)
  : (
    "N/A"
  )
}

</td>

<td className="p-3">

<button

onClick={() =>
  stopDeployment(
    deployment.id
  )
}

className="
  bg-red-600
  hover:bg-red-700
  px-4
  py-2
  rounded
"
>

Stop

</button>

</td>

</tr>
))
}

</tbody>

</table>

</div>

</div>
);
}

export default DeploymentTable;
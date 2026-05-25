import {

  deleteDeployment,

} from "../services/deploymentService";

function DeploymentTable({

  deployments,

  fetchDashboardData,

}) {

  const handleDelete =
    async (id) => {

      try {

        await deleteDeployment(
          id
        );

        fetchDashboardData();

      } catch (error) {

        console.log(error);
      }
    };

  return (

<div className="
  mt-10
">

<h2 className="
  text-3xl
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
  bg-gray-900
  rounded-xl
  overflow-hidden
">

<thead className="
  bg-gray-800
">

<tr>

<th className="
  p-4
  text-left
">

Status

</th>

<th className="
  p-4
  text-left
">

URL

</th>

<th className="
  p-4
  text-left
">

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
  border-t
  border-gray-700
"
>

<td className="
  p-4
">

<div className={`
  inline-block
  px-3
  py-1
  rounded-full
  text-sm
  font-bold

  ${

deployment.status ===
"completed"

? "bg-green-600"

: deployment.status ===
"failed"

? "bg-red-600"

: "bg-yellow-600"

}
`}>

{
deployment.status
}

</div>

</td>

<td className="
  p-4
">

{

deployment.deployedUrl

? (

<a

href={
deployment.deployedUrl
}

target="_blank"

rel="noreferrer"

className="
  text-blue-400
  underline
"
>

Open App

</a>

)

: (

<span>

N/A

</span>
)
}

</td>

<td className="
  p-4
">

<button

onClick={() =>

handleDelete(
  deployment.id
)

}

className="
  bg-red-600
  px-4
  py-2
  rounded-lg
"
>

Delete

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

export default
DeploymentTable;
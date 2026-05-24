import StatusBadge from "./StatusBadge";

function DeploymentTable({
  deployments,
}) {

  return (

    <div className="bg-gray-900 p-6 rounded-xl">

      <h2 className="text-2xl font-bold mb-6 text-white">
        Deployment History
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full text-white">

          <thead>

            <tr className="text-left border-b border-gray-700">

              <th className="pb-4">
                Project
              </th>

              <th className="pb-4">
                Status
              </th>

              <th className="pb-4">
                Logs
              </th>

              <th className="pb-4">
                Created
              </th>

              <th className="pb-4">
                Port
              </th>

            </tr>

          </thead>

          <tbody>

            {
              deployments.map(
                (deployment) => (

                <tr
                  key={deployment.id}
                  className="border-b border-gray-800"
                >

                  <td className="py-4">

                    {
                      deployment.project.name
                    }

                  </td>

                  <td className="py-4">

                    <StatusBadge
                      status={
                        deployment.status
                      }
                    />

                  </td>

                  <td className="py-4">

                    {
                      deployment.logs
                    }

                  </td>

                  <td className="py-4">

                    {
                      new Date(
                        deployment.createdAt
                      ).toLocaleString()
                    }

                  </td>

                  <td className="py-4 font-semibold text-cyan-400">

                    {
                      deployment.port
                        ? deployment.port
                        : "-"
                    }

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
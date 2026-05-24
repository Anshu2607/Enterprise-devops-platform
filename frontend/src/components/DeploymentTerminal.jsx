function DeploymentTerminal({

  deployments,

}) {

  return (

    <div className="
      bg-black
      text-green-400
      rounded-xl
      p-6
      mt-10
      font-mono
      shadow-2xl
      border
      border-green-500
    ">

      <div className="
        flex
        items-center
        gap-2
        mb-4
      ">

        <div className="
          w-3
          h-3
          rounded-full
          bg-red-500
        " />

        <div className="
          w-3
          h-3
          rounded-full
          bg-yellow-500
        " />

        <div className="
          w-3
          h-3
          rounded-full
          bg-green-500
        " />

        <span className="ml-4 text-white">

          Deployment Terminal

        </span>

      </div>

      <div className="
        h-96
        overflow-y-auto
        space-y-2
      ">

        {
          deployments.map(
            (deployment) => (

            <div
              key={deployment.id}
              className="
                border-b
                border-gray-800
                pb-2
              "
            >

              <p>

                <span className="text-cyan-400">
                  $
                </span>

                {" "}

                {
                  deployment.project.name
                }

              </p>

              <p className="text-white">

                {
                  deployment.logs
                }

              </p>

              <p className="
                text-xs
                text-gray-500
              ">

                {
                  new Date(
                    deployment.createdAt
                  ).toLocaleString()
                }

              </p>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default DeploymentTerminal;
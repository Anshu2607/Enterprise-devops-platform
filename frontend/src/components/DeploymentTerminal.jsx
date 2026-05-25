import {

  useEffect,

  useState,

} from "react";

import socket from "../socket";

function DeploymentTerminal({

  deployments,

}) {

  const [

    containerLogs,

    setContainerLogs,

  ] = useState({});

  useEffect(() => {

    socket.on(

      "container-log",

      (data) => {

        setContainerLogs(

          (prev) => ({

            ...prev,

            [

              data.deploymentId

            ]:

              (

                prev[
                  data.deploymentId
                ] || ""

              ) + data.log,
          })
        );
      }
    );

    return () => {

      socket.off(
        "container-log"
      );
    };

  }, []);

  return (

    <div className="
      mt-10
      bg-black
      rounded-xl
      p-6
    ">

      <h2 className="
        text-2xl
        font-bold
        text-green-400
        mb-6
      ">

        Live Container Logs

      </h2>

      {

        deployments.map(
          (deployment) => (

<div

key={deployment.id}

className="
  mb-6
"
>

<div className="
  text-blue-400
  mb-2
">

Deployment:

{
  deployment.id
}

</div>

<pre className="
  bg-gray-950
  text-green-400
  p-4
  rounded-lg
  overflow-x-auto
  max-h-80
  overflow-y-auto
  text-sm
">

{

containerLogs[
  deployment.id
] ||

"No container logs yet..."

}

</pre>

</div>
))
}

</div>
);
}

export default
DeploymentTerminal;
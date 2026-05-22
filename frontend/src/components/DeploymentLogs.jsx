import { useEffect, useState } from "react";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function DeploymentLogs() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {

    socket.on(
      "deployment-log",
      (data) => {

        setLogs((prev) => [
          ...prev,
          data.message,
        ]);
      }
    );

    return () => {
      socket.off("deployment-log");
    };

  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl">

      <h2 className="text-2xl font-bold mb-4">
        Live Deployment Logs
      </h2>

      <div className="space-y-2">

        {
          logs.map((log, index) => (

            <div
              key={index}
              className="bg-gray-800 p-3 rounded"
            >
              {log}
            </div>
          ))
        }

      </div>
    </div>
  );
}

export default DeploymentLogs;
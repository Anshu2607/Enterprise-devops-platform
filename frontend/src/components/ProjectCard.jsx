import {
  useState,
} from "react";

import axios from "axios";

function ProjectCard({ project }) {

  const [repoUrl, setRepoUrl] =
    useState("");

  const handleDeploy =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(

          "http://localhost:5000/api/deploy",

          {

            projectId:
              project.id,

            repoUrl,
          },

          {

            headers: {

              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        alert(
          "Deployment started"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Deployment failed"
        );
      }
};

return (

<div className="
  bg-gray-900
  p-6
  rounded-xl
">

<h2 className="
  text-2xl
  font-bold
  text-white
  mb-4
">

{
  project.name
}

</h2>

<input

type="text"

placeholder="
GitHub Repository URL
"

value={repoUrl}

onChange={(e) =>
  setRepoUrl(
    e.target.value
  )
}

className="
  w-full
  p-3
  rounded
  bg-gray-800
  text-white
  mb-4
"

/>

<button

onClick={handleDeploy}

className="
  bg-green-600
  hover:bg-green-700
  text-white
  px-4
  py-2
  rounded
  w-full
"
>

Deploy

</button>

</div>
);
}

export default ProjectCard;
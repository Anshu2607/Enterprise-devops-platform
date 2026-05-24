function StatusBadge({ status }) {

  const getColor = () => {

    switch (status) {

      case "completed":
        return "bg-green-600";

      case "failed":
        return "bg-red-600";

      case "building":
        return "bg-yellow-500";

      case "deploying":
        return "bg-blue-500";

      case "cloning":
        return "bg-purple-500";

      default:
        return "bg-gray-500";
    }
  };

  return (

    <span
      className={`
        px-3
        py-1
        rounded-full
        text-sm
        font-semibold
        text-white
        ${getColor()}
      `}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
function StatsCard({

  title,

  value,

  color,

}) {

  return (

    <div className={`
      p-6
      rounded-xl
      shadow-lg
      ${color}
    `}>

      <h3 className="
        text-lg
        font-semibold
        mb-2
      ">
        {title}
      </h3>

      <p className="
        text-4xl
        font-bold
      ">
        {value}
      </p>

    </div>
  );
}

export default StatsCard;
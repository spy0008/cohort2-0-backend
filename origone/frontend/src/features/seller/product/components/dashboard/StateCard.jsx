const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition cursor-pointer">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-semibold mt-2">{value}</h2>
    </div>
  );
};

export default StatCard;
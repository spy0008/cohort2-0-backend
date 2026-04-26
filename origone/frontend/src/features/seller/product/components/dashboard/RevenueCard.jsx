const RevenueCard = ({ revenue }) => {
  return (
    <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer">
      <p className="text-sm opacity-80">Total Revenue</p>
      <h1 className="text-3xl font-bold mt-2">₹ {revenue}</h1>
    </div>
  );
};

export default RevenueCard;
const RevenueCard = ({ revenue }) => {
  return (
    <div className="bg-orange-500 text-white p-6 rounded-2xl shadow">
      <p className="text-sm opacity-80">Total Revenue</p>
      <h1 className="text-3xl font-bold mt-2">₹ {revenue}</h1>
    </div>
  );
};

export default RevenueCard;
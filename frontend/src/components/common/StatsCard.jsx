const StatsCard = ({ icon: Icon, label, value, trend, color = 'blue', alert = false }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className={`h-11 w-11 rounded-xl ${colors[color]} flex items-center justify-center`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
            alert ? 'bg-red-50 text-red-600' : trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'
          }`}>
            {alert ? '! High' : `${trend > 0 ? '+' : ''}${trend}%`}
            {!alert && <span className="text-[10px]">↗</span>}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default StatsCard;

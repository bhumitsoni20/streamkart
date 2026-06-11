const StatsCard = ({ icon: Icon, label, value, trend, color = 'blue' }) => {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/20 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/20 text-purple-400',
    green: 'from-emerald-500/20 to-emerald-600/20 text-emerald-400',
    amber: 'from-amber-500/20 to-amber-600/20 text-amber-400',
  };

  return (
    <div className="bg-gray-900/80 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
};

export default StatsCard;

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'ott', label: 'OTT Platforms' },
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'vpn', label: 'VPN Services' },
  { value: 'education', label: 'Education' },
  { value: 'software', label: 'Software Licenses' },
  { value: 'cloud-storage', label: 'Cloud Storage' },
  { value: 'premium-membership', label: 'Premium Membership' },
];

const CategoryFilter = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selected === cat.value
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

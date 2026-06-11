import { HiFilm, HiLightningBolt, HiShieldCheck, HiAcademicCap, HiDesktopComputer, HiCloud, HiStar } from 'react-icons/hi';

const categories = [
  { value: '', label: 'All', icon: null, color: 'bg-gray-400' },
  { value: 'ott', label: 'OTT Platforms', icon: HiFilm, color: 'bg-indigo-500' },
  { value: 'ai-tools', label: 'AI & Productivity', icon: HiLightningBolt, color: 'bg-blue-500' },
  { value: 'vpn', label: 'VPN & Security', icon: HiShieldCheck, color: 'bg-emerald-500' },
  { value: 'education', label: 'Education & Learning', icon: HiAcademicCap, color: 'bg-amber-500' },
  { value: 'software', label: 'Company Use', icon: HiDesktopComputer, color: 'bg-purple-500' },
  { value: 'cloud-storage', label: 'Natural Device', icon: HiCloud, color: 'bg-teal-500' },
  { value: 'premium-membership', label: 'Sound', icon: HiStar, color: 'bg-rose-500' },
];

const CategoryFilter = ({ selected, onSelect, variant = 'cards' }) => {
  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.filter(c => c.value).map((cat) => (
          <button
            key={cat.value}
            onClick={() => onSelect(selected === cat.value ? '' : cat.value)}
            className={`group flex flex-col items-start gap-3 p-5 rounded-2xl border transition-all duration-200 hover-lift text-left ${
              selected === cat.value
                ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`h-10 w-10 rounded-xl ${selected === cat.value ? 'bg-indigo-100' : 'bg-gray-100'} flex items-center justify-center transition-colors`}>
              {cat.icon && <cat.icon className={`w-5 h-5 ${selected === cat.value ? 'text-indigo-600' : 'text-gray-500'}`} />}
            </div>
            <p className={`text-sm font-semibold ${selected === cat.value ? 'text-indigo-600' : 'text-gray-900'}`}>
              {cat.label}
            </p>
            <div className={`h-1 w-full rounded-full ${selected === cat.value ? 'bg-indigo-500' : cat.color} opacity-80`} />
          </button>
        ))}
      </div>
    );
  }

  // Pill variant for sidebar/filters
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selected === cat.value
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

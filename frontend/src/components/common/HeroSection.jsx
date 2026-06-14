import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import SearchBar from '../ui/SearchBar';
import { HiShieldCheck } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import { getPublicStats } from '../../services/public.service';

const HeroSection = ({ onSearch }) => {
  const { data: stats } = useQuery({
    queryKey: ['publicStats'],
    queryFn: async () => {
      const response = await getPublicStats();
      return response.data;
    },
  });

  const userCountText = stats?.totalUsers !== undefined
    ? `${stats.totalUsers.toLocaleString()}+` 
    : '50k+';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Grid pattern background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight animate-slideUp">
          Empower Your<br />
          <span className="gradient-text">Digital Lifestyle.</span>
        </h1>

        <SearchBar onSearch={onSearch} className="max-w-xl mx-auto mb-6 animate-slideUp animate-stagger-1" />

        <div className="flex items-center justify-center gap-2 text-gray-500 animate-slideUp animate-stagger-2">
          <HiShieldCheck className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-medium">Trusted by <span className="text-indigo-600 font-semibold">{userCountText}</span> users</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

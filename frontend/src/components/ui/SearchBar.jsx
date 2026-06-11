import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';

const SearchBar = ({ onSearch, placeholder = 'Search subscriptions...', className = '' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
      />
    </form>
  );
};

export default SearchBar;

import { useState } from 'react';
import { HiSearch } from 'react-icons/hi';

const SearchBar = ({ onSearch, placeholder = 'Search for subscriptions, AI tools, or services...', className = '' }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
        <HiSearch className="h-5 w-5 text-white" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-full pl-16 pr-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-300 shadow-sm text-base"
      />
    </form>
  );
};

export default SearchBar;

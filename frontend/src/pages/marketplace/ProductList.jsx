import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/cards/ProductCard';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { useProducts } from '../../hooks/useProducts';
import { HiSearch } from 'react-icons/hi';

const allCategories = [
  { value: 'ai-tools', label: 'AI & Machine Learning' },
  { value: 'software', label: 'Creative Tools' },
  { value: 'ott', label: 'Productivity' },
  { value: 'education', label: 'Developer Tools' },
  { value: 'cloud-storage', label: 'Data & Analytics' },
];

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCats, setSelectedCats] = useState(category ? [category] : []);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', '20');
  if (selectedCats.length > 0) params.set('category', selectedCats[0]);
  if (search) params.set('search', search);

  const { data, isLoading } = useProducts(params.toString());

  const toggleCategory = (cat) => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCats([]);
    setPriceRange([0, 2000]);
    setRatingFilter(0);
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Filters</h3>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-between">
              Categories <span className="text-gray-400 cursor-pointer">^</span>
            </h4>
            <div className="space-y-2.5">
              {allCategories.map((cat) => (
                <label key={cat.value} className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat.value)}
                    onChange={() => toggleCategory(cat.value)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h4>
            <input
              type="range"
              min="0"
              max="2000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$0</span>
              <span>${priceRange[1]}+</span>
            </div>
          </div>

          {/* Clear Filters */}
          <Button variant="secondary" size="sm" className="w-full" onClick={clearFilters}>
            Clear All Filters
          </Button>

          {/* Rating */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center justify-between">
              Rating <span className="text-gray-400 cursor-pointer">^</span>
            </h4>
            <div className="space-y-2">
              {[5, 3, 2, 1].map((r) => (
                <button key={r} onClick={() => setRatingFilter(r)} className={`flex items-center gap-1 w-full text-left text-sm ${ratingFilter === r ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-base ${i < r ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                  ))}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Explore Marketplace</h1>
            <p className="text-gray-500">Discover premium digital subscriptions and accelerate your workflow.</p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {(!data?.data || data.data.length === 0) && (
                <div className="text-center py-16"><p className="text-gray-500 text-lg">No products found</p></div>
              )}

              {data?.pagination && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Showing 1-{data.data?.length || 0} of {data.pagination.total || 0} products</p>
                  <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

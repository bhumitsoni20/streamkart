import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/cards/ProductCard';
import CategoryFilter from '../../components/common/CategoryFilter';
import SearchBar from '../../components/ui/SearchBar';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import { useProducts } from '../../hooks/useProducts';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', '12');
  if (category) params.set('category', category);
  if (search) params.set('search', search);

  const { data, isLoading } = useProducts(params.toString());

  const handleCategoryChange = (cat) => {
    setSearchParams(cat ? { category: cat } : {});
    setPage(1);
  };

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
        <p className="text-gray-500">Discover premium digital subscriptions</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <SearchBar onSearch={handleSearch} className="flex-1" />
      </div>

      <div className="mb-8">
        <CategoryFilter selected={category} onSelect={handleCategoryChange} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {(!data?.data || data.data.length === 0) && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}

          {data?.pagination && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.pages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;

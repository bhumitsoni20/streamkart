import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/cards/ProductCard';
import SearchBar from '../../components/ui/SearchBar';
import Spinner from '../../components/ui/Spinner';
import Pagination from '../../components/ui/Pagination';
import { useProducts } from '../../hooks/useProducts';

const Search = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [search, setSearch] = useState(initialQuery);
  const [page, setPage] = useState(1);

  const params = `page=${page}&limit=12&search=${encodeURIComponent(search)}`;
  const { data, isLoading } = useProducts(params);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Search Results</h1>
      <SearchBar onSearch={(q) => { setSearch(q); setPage(1); }} placeholder="Search subscriptions..." className="mb-8" />

      {search && <p className="text-gray-500 mb-6">Showing results for "<span className="text-white">{search}</span>"</p>}

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
          {(!data?.data || data.data.length === 0) && (
            <div className="text-center py-16"><p className="text-gray-500 text-lg">No results found</p></div>
          )}
          {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
};

export default Search;

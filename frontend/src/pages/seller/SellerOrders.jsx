import { useState } from 'react';
import OrderCard from '../../components/cards/OrderCard';
import Pagination from '../../components/ui/Pagination';
import Spinner from '../../components/ui/Spinner';
import { useSellerOrders } from '../../hooks/useOrders';

const SellerOrders = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useSellerOrders(`page=${page}&limit=10`);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Seller Orders</h1>
      {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : (
        <>
          <div className="space-y-3">
            {data?.data?.map((o) => <OrderCard key={o._id} order={o} />)}
            {(!data?.data || data.data.length === 0) && <p className="text-gray-500 text-center py-12">No orders received yet</p>}
          </div>
          {data?.pagination && <Pagination page={data.pagination.page} totalPages={data.pagination.pages} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
};

export default SellerOrders;

import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <HiChevronLeft className="w-5 h-5" />
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-10 h-10 rounded-lg font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">1</button>
          {start > 2 && <span className="text-gray-400 px-1">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`w-10 h-10 rounded-lg font-medium transition-all ${p === page ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400 px-1">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-10 h-10 rounded-lg font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all">{totalPages}</button>
        </>
      )}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

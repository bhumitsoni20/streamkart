import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <HiChevronLeft className="w-5 h-5" />
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`w-10 h-10 rounded-lg font-medium transition-all ${p === page ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

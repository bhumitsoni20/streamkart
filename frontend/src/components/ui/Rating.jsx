import { HiStar } from 'react-icons/hi';

const Rating = ({ value = 0, max = 5, size = 'md', showValue = true }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => (
        <HiStar key={i} className={`${sizes[size]} ${i < Math.round(value) ? 'text-amber-400' : 'text-gray-200'}`} />
      ))}
      {showValue && <span className="ml-1.5 text-sm font-medium text-gray-600">{value.toFixed(1)}</span>}
    </div>
  );
};

export default Rating;

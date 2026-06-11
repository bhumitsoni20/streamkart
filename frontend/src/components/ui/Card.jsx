const Card = ({ children, className = '', hover = true, glass = false }) => {
  return (
    <div
      className={`rounded-2xl border border-white/10 ${glass ? 'bg-white/5 backdrop-blur-xl' : 'bg-gray-900/80'} ${hover ? 'hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

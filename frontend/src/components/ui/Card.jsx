const Card = ({ children, className = '', hover = true, padding = true }) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white ${hover ? 'hover-lift' : ''} ${padding ? 'p-6' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;

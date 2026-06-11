const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' };
  const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white shadow-sm ${className}`} />;
  }

  return (
    <div className={`${sizes[size]} rounded-full ${colors[colorIndex]} flex items-center justify-center font-semibold text-white ring-2 ring-white shadow-sm ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;

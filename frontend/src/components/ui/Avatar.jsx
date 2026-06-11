const Avatar = ({ src, name = '', size = 'md', className = '' }) => {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg', xl: 'h-20 w-20 text-2xl' };
  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white/10 ${className}`} />;
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold text-white ring-2 ring-white/10 ${className}`}>
      {initials}
    </div>
  );
};

export default Avatar;

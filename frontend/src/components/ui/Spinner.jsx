const Spinner = ({ size = 'md', fullScreen = false }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div className={`${sizes[size]} animate-spin rounded-full border-2 border-white/20 border-t-blue-500`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
          <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export default Spinner;

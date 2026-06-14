import Spinner from './Spinner';

const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4">
      <Spinner size="lg" className="text-indigo-600" />
      <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default PageLoader;

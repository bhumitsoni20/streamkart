import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFound = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">404</h1>
      <p className="text-xl text-white mb-2">Page Not Found</p>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  </div>
);

export default NotFound;

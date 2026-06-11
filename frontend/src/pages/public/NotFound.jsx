import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFound = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center animate-fadeIn">
      <h1 className="text-8xl font-extrabold gradient-text mb-4">404</h1>
      <p className="text-xl text-gray-900 font-semibold mb-2">Page Not Found</p>
      <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/"><Button>Go Home</Button></Link>
    </div>
  </div>
);

export default NotFound;

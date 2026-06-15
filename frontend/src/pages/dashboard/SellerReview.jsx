import { Navigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { HiOutlineClock, HiOutlineExclamationCircle } from 'react-icons/hi';

const SellerReview = () => {
  const { user } = useAuthStore();

  if (user?.sellerStatus === 'none') {
    return <Navigate to="/dashboard/apply-seller" replace />;
  }

  if (user?.sellerStatus === 'approved') {
    return <Navigate to="/seller" replace />;
  }

  const isRejected = user?.sellerStatus === 'rejected';

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isRejected ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
            {isRejected ? <HiOutlineExclamationCircle className="w-8 h-8" /> : <HiOutlineClock className="w-8 h-8" />}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isRejected ? 'Application Not Approved' : 'Seller Account Under Review'}
          </h1>
          
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            {isRejected 
              ? 'Your seller application was not approved. Please contact support for more information on our seller policies or to appeal this decision.'
              : 'Thank you for applying to become a seller on Streamkart. Your application is currently under review. Verification may take up to 24 hours. Once approved, you will gain access to the Seller Dashboard and can start selling products.'
            }
          </p>

          <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8 border border-gray-100 text-left">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-500">Current Status</span>
                <Badge variant={isRejected ? 'inactive' : 'pending'}>
                  {isRejected ? 'Rejected' : 'Pending Review'}
                </Badge>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-500">Application Submitted</span>
                <span className="text-sm text-gray-900 font-medium">
                  {user?.applicationSubmittedAt ? new Date(user.applicationSubmittedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              {!isRejected && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Estimated Time</span>
                  <span className="text-sm text-gray-900 font-medium">Up to 24 hours</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="flex-1 max-w-[200px]">
              <Button className="w-full">Go to Marketplace</Button>
            </Link>
            <Link to="/dashboard" className="flex-1 max-w-[200px]">
              <Button variant="secondary" className="w-full">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerReview;

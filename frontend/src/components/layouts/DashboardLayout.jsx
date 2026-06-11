import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 lg:pl-60 min-h-screen">
        <div className="p-6 lg:p-8 animate-fadeIn">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

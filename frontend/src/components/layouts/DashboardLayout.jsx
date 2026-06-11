import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <Sidebar />
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

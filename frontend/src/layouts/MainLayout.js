import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWorkload } from '../context/WorkloadContext';

const MainLayout = () => {
  const location = useLocation();
  const { workload } = useWorkload();
  const userType = workload.userType || 'business';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Show navigation tabs on dashboard page */}
        {location.pathname === '/' && (
          <div className="mb-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/workload/simple" 
              className={userType === 'business' ? "btn-business" : "btn-primary"}
            >
              Business Cloud Strategy
            </Link>
            <Link 
              to="/workload/detailed" 
              className={userType === 'developer' ? "btn-developer" : "btn-secondary"}
            >
              Technical Cloud Architecture
            </Link>
          </div>
        )}
        
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
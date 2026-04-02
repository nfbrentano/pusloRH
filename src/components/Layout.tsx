import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-surface text-on-surface min-h-screen relative">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <Header title={title} onMenuClick={toggleSidebar} />
      
      <main className="pt-24 pb-20 md:pb-8 md:pl-72 lg:pr-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;

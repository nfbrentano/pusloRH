import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-surface text-on-surface min-h-screen relative overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} isCollapsed={isSidebarCollapsed} />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      <Header
        title={title}
        onMenuClick={toggleSidebar}
        onToggleCollapse={toggleCollapse}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <main
        className={cn(
          'pt-24 pb-20 md:pb-8 transition-all duration-300 min-h-screen px-4 md:px-8',
          isSidebarCollapsed ? 'md:pl-8' : 'md:pl-80'
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;

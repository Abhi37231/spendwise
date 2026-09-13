import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Receipt, 
  PlusCircle, 
  PieChart, 
  BarChart3, 
  UserCircle, 
  Settings, 
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Bell
} from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { name: 'Add Expense', path: '/add-expense', icon: <PlusCircle size={20} /> },
    { name: 'Budget', path: '/budget', icon: <PieChart size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-card border-r transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/dashboard" className="text-2xl font-bold text-primary flex items-center gap-2">
            SpendWise
          </Link>
          <button className="lg:hidden text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between py-4">
          <nav className="px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 border-t pt-4 space-y-1">
            <Link
              to="/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                location.pathname === '/profile' 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Settings size={20} />
              Settings
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold hidden md:block">
              {navItems.find(i => i.path === location.pathname)?.name || 'Settings'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            
            <button 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">Free Plan</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

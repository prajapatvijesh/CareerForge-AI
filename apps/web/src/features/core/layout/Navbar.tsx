import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useLogout } from '@/features/auth/api/auth.api';

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const logoutMutation = useLogout();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        navigate('/');
        setIsMobileMenuOpen(false);
      },
    });
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center space-x-3" 
            onClick={() => {
              closeMenu();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img src="/logo.jpg" alt="CareerForge AI Logo" className="h-8 w-8 rounded-md object-cover shadow-sm" />
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">
              CareerForge AI
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="mr-2"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium mr-4">
                  Hi, {user?.name}
                </span>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                {user?.role?.toUpperCase() === 'ADMIN' && (
                  <Button asChild variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400">
                    <Link to="/admin">Admin Panel</Link>
                  </Button>
                )}
                <Button asChild variant="ghost" size="sm">
                  <Link to="/resumes">Resumes</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/jobs">Jobs</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/interviews">Interviews</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                  <Link to="/assistant">Assistant</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="ml-2">
                  <Link to="/profile">Profile</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background px-4 py-4 space-y-4 shadow-lg absolute w-full left-0">
          {isAuthenticated ? (
            <div className="flex flex-col space-y-3">
              <span className="text-sm font-medium px-2 pb-2 border-b">
                Hi, {user?.name}
              </span>
              <Link to="/dashboard" onClick={closeMenu} className="text-sm font-medium hover:text-primary px-2 py-1">Dashboard</Link>
              {user?.role?.toUpperCase() === 'ADMIN' && (
                <Link to="/admin" onClick={closeMenu} className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 px-2 py-1">Admin Panel</Link>
              )}
              <Link to="/resumes" onClick={closeMenu} className="text-sm font-medium hover:text-primary px-2 py-1">Resumes</Link>
              <Link to="/jobs" onClick={closeMenu} className="text-sm font-medium hover:text-primary px-2 py-1">Jobs</Link>
              <Link to="/interviews" onClick={closeMenu} className="text-sm font-medium hover:text-primary px-2 py-1">Interviews</Link>
              <Link to="/assistant" onClick={closeMenu} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 px-2 py-1">Assistant</Link>
              <Link to="/profile" onClick={closeMenu} className="text-sm font-medium hover:text-primary px-2 py-1">Profile</Link>
              <button 
                onClick={handleLogout} 
                disabled={logoutMutation.isPending}
                className="text-left text-sm font-medium text-destructive hover:text-destructive/80 px-2 py-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="w-full justify-start" onClick={closeMenu}>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="default" className="w-full justify-start" onClick={closeMenu}>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

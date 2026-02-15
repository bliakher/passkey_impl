import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Link, useNavigate } from 'react-router';
import { SideMenu } from './SideMenu';
import { getUser, logout } from '~/lib/auth';

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = () => {
      const user = getUser();
      setIsAuthenticated(!!user);
    };

    // Check auth state on mount
    handleAuthChange();

    // Listen for auth state changes
    window.addEventListener('authChange', handleAuthChange);

    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-xl text-white hover:text-gray-300">
            <h1>Passkey Auth Test</h1>
          </Link>
          <Link to="/" className="hidden md:block">
            <Button variant="ghost">About</Button>
          </Link>
        </div>
        <div className="hidden md:flex items-center">
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="outline" className="text-gray-900 hover:bg-gray-200">
              Logout
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button className="mr-2 hover:bg-gray-700 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="text-gray-900 hover:bg-gray-200">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden">
          <SideMenu isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect } from 'react';
import { Button } from "~/components/ui/button";
import { Link, useNavigate } from 'react-router';
import { SideMenu } from './SideMenu';
import { getUser, logout } from '~/lib/auth';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu';

export function Header() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getUser());
    };

    handleAuthChange();

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
        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600 text-sm font-semibold uppercase hover:bg-gray-500 focus:outline-none">
                  {user.username.charAt(0)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

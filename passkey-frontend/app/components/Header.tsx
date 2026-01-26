import React from 'react';
import { Button } from "~/components/ui/button";
import { Link } from 'react-router';
import { SideMenu } from './SideMenu';

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4"> {/* New div for title and About button */}
          <Link to="/" className="text-xl text-white hover:text-gray-300">
            <h1>Passkey Auth Test</h1>
          </Link>
          {/* About button visible on medium screens and up */}
          <Link to="/" className="hidden md:block">
            <Button variant="ghost">About</Button>
          </Link>
        </div>
        <div className="hidden md:flex items-center">
          <Link to="/login">
            <Button className="mr-2 hover:bg-gray-700 hover:text-white">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" className="hover:bg-gray-100 hover:text-gray-900">
              Register
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <SideMenu />
        </div>
      </div>
    </header>
  );
}

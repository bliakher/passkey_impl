import React from 'react';
import { Button } from "~/components/ui/button";
import { Link } from 'react-router';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl text-white hover:text-gray-300">
          <h1>Passkey Auth Test</h1>
        </Link>
        <div className="hidden md:flex items-center">
          <Link to="/login">
            <Button className="mr-2">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">
              Register
            </Button>
          </Link>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-800 text-white">
              <SheetHeader>
                <SheetTitle className="text-white text-2xl">Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-2 mt-4">
                <Link to="/login" className="block py-3 px-4 text-white text-lg hover:bg-gray-700 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="block py-3 px-4 text-white text-lg hover:bg-gray-700 rounded-md">
                  Register
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

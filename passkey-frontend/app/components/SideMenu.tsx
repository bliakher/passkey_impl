import React, { useState } from 'react';
import { Button } from "~/components/ui/button";
import { Link } from 'react-router';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

interface SideMenuProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function SideMenu({ isAuthenticated, onLogout }: SideMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-gray-800 text-white" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-2 mt-4">
          <Link to="/" onClick={() => setOpen(false)} className="block py-3 px-4 text-white text-lg hover:bg-gray-700 rounded-md">
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/profile" onClick={() => setOpen(false)} className="block py-3 px-4 text-white text-lg hover:bg-gray-700 rounded-md">
              Profile
            </Link>
          )}
        </div>
        <hr className="my-4 border-gray-600" />
        <div className="flex flex-col space-y-2">
          {isAuthenticated ? (
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                variant="outline"
                className="w-32 bg-gray-100 text-gray-900 hover:bg-gray-200"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-32 hover:bg-gray-700 hover:text-white">
                    Login
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center">
                <Link to="/register" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-32 bg-gray-100 text-gray-900 hover:bg-gray-200">
                    Register
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

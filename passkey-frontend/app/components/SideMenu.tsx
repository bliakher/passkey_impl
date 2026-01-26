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

export function SideMenu() {
  return (
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
          <Link to="/" className="block py-3 px-4 text-white text-lg hover:bg-gray-700 rounded-md">
            About
          </Link>
        </div>
        <hr className="my-4 border-gray-600" /> {/* Separator line */}
        <div className="flex flex-col space-y-2">
          <div className="flex justify-center">
            <Link to="/login">
              <Button variant="outline" className="w-32 hover:bg-gray-700 hover:text-white">
                Login
              </Button>
            </Link>
          </div>
          <div className="flex justify-center">
            <Link to="/register">
              <Button variant="outline" className="w-32 bg-gray-100 text-gray-900 hover:bg-gray-200">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

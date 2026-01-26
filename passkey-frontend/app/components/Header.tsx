import React from 'react';
import { Button } from "~/components/ui/button";

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl">My App</h1>
        <div>
          <Button className="mr-2">
            Login
          </Button>
          <Button variant="outline">
            Register
          </Button>
        </div>
      </div>
    </header>
  );
}

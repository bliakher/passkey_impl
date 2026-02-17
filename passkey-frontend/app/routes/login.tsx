import React from 'react';
import { Link } from 'react-router';
import { LoginForm } from '~/components/LoginForm';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { KeyRound } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] p-4">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white text-center text-3xl">Log in</CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <LoginForm />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-500" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-800 px-2 text-gray-400">or</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent border-gray-500 text-white hover:bg-gray-700"
          >
            <KeyRound className="h-5 w-5" />
            Continue with Passkeys
          </Button>
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-gray-400">
        Don't have an account yet? Please, <Link to="/register" className="text-blue-400 underline hover:text-blue-300">register</Link>.
      </p>
    </div>
  );
}

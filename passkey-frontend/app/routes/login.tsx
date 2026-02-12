import React from 'react';
import { LoginForm } from '~/components/LoginForm';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4"> {/* Added p-4 for some padding on small screens */}
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white text-center text-3xl">Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}

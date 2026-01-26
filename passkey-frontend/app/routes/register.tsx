import React from 'react';
import { RegisterForm } from "~/components/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4"> {/* Added p-4 for some padding on small screens */}
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white text-center text-3xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}

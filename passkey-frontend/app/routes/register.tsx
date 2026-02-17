import React from 'react';
import { Link } from 'react-router';
import { RegisterForm } from "~/components/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] p-4">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white text-center text-3xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-gray-400">
        Already have an account? Please, <Link to="/login" className="text-blue-400 underline hover:text-blue-300">log in</Link>.
      </p>
    </div>
  );
}

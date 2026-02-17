import { Link } from 'react-router';
import { LoginForm } from '~/components/LoginForm';
import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-64px)] p-4">
      <Card className="bg-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white text-center text-3xl">Log in</CardTitle>
        </CardHeader>
        <CardContent className="p-10">
          <LoginForm />
        </CardContent>
      </Card>
      <p className="mt-4 text-sm text-gray-400">
        Don't have an account yet? Please, <Link to="/register" className="text-blue-400 underline hover:text-blue-300">register</Link>.
      </p>
    </div>
  );
}

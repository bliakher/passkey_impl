import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { getUser } from '~/lib/auth';
import { USER_QUERY } from '~/graphql/queries/user';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card';
import { PasskeyTable } from '~/components/PasskeyTable';
import { User, KeyRound } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getUser());
    };

    handleAuthChange();

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  console.log(user);
  const { data, loading, error } = useQuery(USER_QUERY, {
    variables: { id: user?.id! },
    skip: !user,
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="w-full bg-gray-100 text-gray-900 border-gray-300">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, Passkey enthusiast!</CardTitle>
        </CardHeader>
        <hr className="border-gray-300" />
        <CardContent>
          {user && (
            <p className="text-gray-600 flex items-center gap-2">
              <User className="h-4 w-4" />
              Logged in as <span className="font-semibold text-gray-900">{user.username}</span>
            </p>
          )}
        </CardContent>
      </Card>
      <Card className="w-full bg-gray-100 text-gray-900 border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Your Passkeys
            <KeyRound className="h-5 w-5" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-gray-500 text-sm">Loading credentials...</p>}
          {error && <p className="text-red-500 text-sm">Failed to load credentials.
            {error.message}
          </p>}
          {data && <PasskeyTable credentials={data.user.credentials} />}
        </CardContent>
      </Card>
    </div>
  );
}

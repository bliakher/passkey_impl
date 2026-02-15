import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card';
import { ShieldCheck, KeyRound } from 'lucide-react';

export default function SuggestPasskey() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-96 bg-gray-800 text-white border-gray-700 py-10 px-4">
        <CardHeader className="items-center">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-7 w-7" />
            Register a passkey
          </CardTitle>
          <CardDescription className="text-center text-gray-300">
            Add a passkey to your account for safe and password-free access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-white text-gray-900 hover:bg-gray-200 font-semibold">
            <KeyRound className="mr-2 h-5 w-5" />
            Register a passkey
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => navigate('/profile')}
          >
            Skip
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

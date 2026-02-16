import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client/react';
import { startRegistration, type PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';
import { Button } from '~/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card';
import { ShieldCheck, KeyRound, CircleCheck } from 'lucide-react';
import { START_PASSKEY_REGISTRATION_MUT } from '~/graphql/mutations/startPasskeyRegistration';
import { FINISH_PASSKEY_REGISTRATION_MUT } from '~/graphql/mutations/finishPasskeyRegistration';

export default function SuggestPasskey() {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [requestRegistrationOptions, { loading: startLoading }] = useMutation(START_PASSKEY_REGISTRATION_MUT);
  const [finishRegistration, { loading: finishLoading }] = useMutation(FINISH_PASSKEY_REGISTRATION_MUT);

  const loading = startLoading || finishLoading;

  async function handleRegisterPasskey() {
    try {
      const result = await requestRegistrationOptions();
      if (result.data?.startPasskeyRegistration) {
        const { challengeId, ...optionsJSON } = result.data.startPasskeyRegistration;
        const credential = await startRegistration({ optionsJSON: optionsJSON as PublicKeyCredentialCreationOptionsJSON });

        const finishResult = await finishRegistration({
          variables: {
            challengeId,
            device: navigator.userAgent,
            registrationResponse: credential as unknown as Record<string, unknown>,
          },
        });

        if (finishResult.data?.finishPasskeyRegistration.ok) {
          setRegistered(true);
        }
      }
    } catch (err) {
      console.error('Failed to register passkey:', err);
    }
  }

  if (registered) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-96 bg-gray-800 text-white border-gray-700 py-10 px-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-5">
              <CircleCheck className="h-12 w-12" />
              Passkey added successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-white text-gray-900 hover:bg-gray-200 font-semibold"
              onClick={() => navigate('/profile')}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Button
            className="w-full bg-white text-gray-900 hover:bg-gray-200 font-semibold"
            onClick={handleRegisterPasskey}
            disabled={loading}
          >
            <KeyRound className="mr-2 h-5 w-5" />
            {loading ? 'Registering…' : 'Register a passkey'}
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

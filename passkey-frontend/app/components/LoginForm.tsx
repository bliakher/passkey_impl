import { useState } from 'react';
import { z } from 'zod';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound } from 'lucide-react';
import { startAuthentication, type PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser';
import { toast } from 'sonner';

import { Divider } from "~/components/Divider";
import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUT } from '~/graphql/mutations/login';
import { START_PASSKEY_AUTHENTICATION_MUT } from '~/graphql/mutations/startPasskeyAuthentication';
import { FINISH_PASSKEY_AUTHENTICATION_MUT } from '~/graphql/mutations/finishPasskeyAuthentication';
import { useNavigate } from 'react-router';
import { saveTokens, saveUser } from '~/lib/auth';

const loginFormSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export function LoginForm() {
    const [mode, setMode] = useState<'passkey' | 'password'>('passkey');
    const [login, { error, loading }] = useMutation(LOGIN_MUT);
    const [startPasskeyAuth] = useMutation(START_PASSKEY_AUTHENTICATION_MUT);
    const [finishPasskeyAuth] = useMutation(FINISH_PASSKEY_AUTHENTICATION_MUT);
    const navigate = useNavigate();

    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onPasskeyLogin() {
        const valid = await form.trigger('email');
        if (!valid) return;

        const email = form.getValues('email');
        try {
            const result = await startPasskeyAuth({
                variables: { username: email },
            });
            const allowCredentials = result.data?.startPasskeyAuthentication?.allowCredentials ?? [];
            if (allowCredentials.length === 0) {
                toast('There are no passkeys registered to this account. You can register a passkey after you log in.');
                setMode('password');
                return;
            }
            const { challengeId, ...optionsJSON } = result.data!.startPasskeyAuthentication;
            const credential = await startAuthentication({ optionsJSON: optionsJSON as PublicKeyCredentialRequestOptionsJSON });

            const finishResult = await finishPasskeyAuth({
                variables: {
                    challengeId,
                    authenticationResponse: credential as unknown as Record<string, unknown>,
                },
            });

            if (finishResult.data?.finishPasskeyAuthentication) {
                const { accessToken, refreshToken, user } = finishResult.data.finishPasskeyAuthentication;
                saveTokens(accessToken, refreshToken);
                saveUser(user);
                navigate('/profile');
            }
        } catch (err) {
            console.error('Passkey auth error:', err);
        }
    }

    async function onSubmit(values: LoginFormSchema) {
        console.log('Submit:', values);

        try {
            const result = await login({
                variables: {
                    username: values.email,
                    password: values.password,
                },
            });

            if (result.data?.login) {
                const { accessToken, refreshToken, user } = result.data.login;

                saveTokens(accessToken, refreshToken);
                saveUser(user);

                console.log("Logged in user:", user);
                alert("Login successful!");
                navigate('/profile');
            }
        } catch (err) {
            console.error("Login error:", err, error);
        }
    };

    if (mode === 'passkey') {
        return (
            <FormProvider {...form}>
                <div className="space-y-8 w-96 bg-gray-800 text-white rounded-lg shadow-md">
                    <FieldGroup>
                        <Field data-invalid={!!form.formState.errors.email}>
                            <FieldLabel>Email</FieldLabel>
                            <Controller
                                control={form.control}
                                name="email"
                                render={({ fieldState, field }) => (
                                    <Input placeholder="email@example.com" {...field} aria-invalid={fieldState.invalid} />
                                )}
                            />
                            {form.formState.errors.email && (
                                <FieldError errors={[form.formState.errors.email]} />
                            )}
                        </Field>
                    </FieldGroup>
                    <Button
                        variant="outline"
                        className="w-full bg-transparent border-gray-500 text-white hover:bg-gray-700"
                        onClick={onPasskeyLogin}
                    >
                        <KeyRound className="h-5 w-5" />
                        Continue with Passkeys
                    </Button>
                    <Divider label="or" />
                    <Button
                        variant="outline"
                        className="w-full bg-transparent border-gray-500 text-white hover:bg-gray-700"
                        onClick={() => setMode('password')}
                    >
                        Log in with password
                    </Button>
                </div>
            </FormProvider>
        );
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96 bg-gray-800 text-white rounded-lg shadow-md">
                <FieldGroup>
                    <Field data-invalid={!!form.formState.errors.email}>
                        <FieldLabel>Email</FieldLabel>
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ fieldState, field }) => (
                                <Input placeholder="email@example.com" {...field} aria-invalid={fieldState.invalid} />
                            )}
                        />
                        {form.formState.errors.email && (
                            <FieldError errors={[form.formState.errors.email]} />
                        )}
                    </Field>
                    <Field data-invalid={!!form.formState.errors.password}>
                        <FieldLabel>Password</FieldLabel>
                        <Controller
                            control={form.control}
                            name="password"
                            render={({ fieldState, field }) => (
                                <Input type="password" placeholder="********" {...field} aria-invalid={fieldState.invalid} />
                            )}
                        />
                        {form.formState.errors.password && (
                            <FieldError errors={[form.formState.errors.password]} />
                        )}
                    </Field>
                </FieldGroup>
                <div className="flex justify-center">
                    <Button type="submit" disabled={loading} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">Submit</Button>
                </div>
            </form>
        </FormProvider>
    );
}

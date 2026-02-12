import { z } from 'zod';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useMutation } from '@apollo/client/react';
import { LOGIN_MUT } from '~/graphql/mutations/login';
import { useNavigate } from 'react-router';
import { saveTokens, saveUser } from '~/lib/auth';

const loginFormSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export function LoginForm() {

    const [login, { error, loading, data }] = useMutation(LOGIN_MUT);
    const navigate = useNavigate();

    const form = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

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

                // Store tokens and user data
                saveTokens(accessToken, refreshToken);
                saveUser(user);

                console.log("Logged in user:", user);
                alert("Login successful!");
                navigate('/');
            }
        } catch (err) {
            console.error("Login error:", err, error);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-96 p-6 bg-gray-800 text-white rounded-lg shadow-md">
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

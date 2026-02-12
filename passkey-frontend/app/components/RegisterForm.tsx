import { z } from 'zod';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError } from "~/components/ui/field"; // Removed FieldControl, Added FieldError
import { Input } from "~/components/ui/input";
import { useMutation } from '@apollo/client/react';
import { REGISTER_MUT } from '~/graphql/mutations/register';
import { useNavigate } from 'react-router';
import { saveTokens, saveUser } from '~/lib/auth';

const registerFormSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords do not match",
      path: ['confirmPassword'],
    });
  }
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export function RegisterForm() {

  const [register, { error, loading, data }] = useMutation(REGISTER_MUT);
  const navigate = useNavigate();

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormSchema) {
    console.log('Submit:', values);
    try {
      const result = await register({
        variables: {
          username: values.email,
          password: values.password,
        },
      });

      if (result.data?.register) {
        const { accessToken, refreshToken, user } = result.data.register;

        // Store tokens and user data
        saveTokens(accessToken, refreshToken);
        saveUser(user);

        console.log("Registered user:", user);
        alert("Registration successful!");
        navigate('/passkey');
      }
    } catch (err) {
      console.error("Registration error:", err, error);
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
          <Field data-invalid={!!form.formState.errors.confirmPassword}>
            <FieldLabel>Confirm Password</FieldLabel>
            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ fieldState, field }) => (
                <Input type="password" placeholder="********" {...field} aria-invalid={fieldState.invalid} />
              )}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
            )}
          </Field>        </FieldGroup>
        <div className="flex justify-center">
          <Button type="submit" disabled={loading} variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">Submit</Button>
        </div>
      </form>
    </FormProvider>
  );
}

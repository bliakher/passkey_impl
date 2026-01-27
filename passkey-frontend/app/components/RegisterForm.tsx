import React from 'react';
import { z } from 'zod';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError } from "~/components/ui/field"; // Removed FieldControl, Added FieldError
import { Input } from "~/components/ui/input";

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
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: RegisterFormSchema) {
    console.log(values);
    // Handle registration logic here
  }

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
          <Button type="submit" variant="outline" className="hover:bg-gray-700 hover:text-white">Submit</Button>
        </div>
      </form>
    </FormProvider>
  );
}

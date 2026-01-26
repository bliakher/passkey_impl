import React from 'react';
import { z } from 'zod';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldError } from "~/components/ui/field"; // Removed FieldControl, Added FieldError
import { Input } from "~/components/ui/input";

const registerFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
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
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <Input placeholder="email@example.com" {...field} />
              )}
            />
            {/* {form.formState.errors.email && (
              <FieldError errors={[form.formState.errors.email]} />
            )} */}
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Controller
              control={form.control}
              name="password"
              render={({ field }) => (
                <Input type="password" placeholder="********" {...field} />
              )}
            />
            {/* {form.formState.errors.password && (
              <FieldError errors={[form.formState.errors.password]} />
            )} */}
          </Field>
        </FieldGroup>
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </FormProvider>
  );
}

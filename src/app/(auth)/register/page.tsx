"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { UserPlus, Loader2, Mail, KeyRound, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const registerFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { register: authRegister } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    const result = await authRegister(data.email, data.password);
    
    if (result.success) {
      toast({
        title: "Registration Successful",
        description: "You can now log in with your new account.",
      });
      router.push('/login');
    } else {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: result.message || "An unexpected error occurred.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
       <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              Create an Account
            </CardTitle>
            <CardDescription>
              Join MediTrack to start your personalized health journey.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col items-center">
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Create Account
                </Button>
                 <p className="mt-6 text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/login">
                      Login here <LogIn className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-secondary/10 p-10">
        <div className="absolute inset-0 bg-secondary opacity-20"></div>
        <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold text-secondary-foreground tracking-tight mb-4 text-gray-800">Your Health, Simplified.</h1>
            <p className="text-lg text-secondary-foreground/80 text-gray-700">Track, analyze, and take control with powerful AI tools.</p>
        </div>
        <Image
          src="https://placehold.co/1000x1200.png"
          alt="Branding illustration for MediTrack"
          width={1000}
          height={1200}
          className="relative object-cover w-full max-w-md mt-8 rounded-xl shadow-2xl"
          data-ai-hint="medical technology abstract"
          priority
        />
      </div>
    </div>
  );
}

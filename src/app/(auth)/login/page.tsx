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
import { LogIn, Loader2, Mail, KeyRound, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password cannot be empty." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.03,4.73 15.1,5.5 15.71,6.15L17.82,4.12C16.12,2.56 14.11,2 12.19,2C6.92,2 3,6.5 3,12C3,17.5 6.92,22 12.19,22C17.6,22 21.5,18.33 21.5,12.33C21.5,11.76 21.45,11.43 21.35,11.1V11.1Z"></path></svg>
);


export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    const result = await authLogin(data.email, data.password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: result.message || "An unexpected error occurred.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-primary/10 p-10">
        <div className="absolute inset-0 bg-primary opacity-20"></div>
        <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold text-primary-foreground tracking-tight mb-4 text-gray-800">Transform Your Health Journey</h1>
            <p className="text-lg text-primary-foreground/80 text-gray-700">Intelligent insights, personalized care, all in one place.</p>
        </div>
        <Image
          src="https://placehold.co/1000x1200.png"
          alt="Branding illustration for MediTrack"
          width={1000}
          height={1200}
          className="relative object-cover w-full max-w-md mt-8 rounded-xl shadow-2xl"
          data-ai-hint="health technology abstract"
          priority
        />
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Login to access your MediTrack dashboard.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" type="button"><GoogleIcon/> Continue with Google</Button>
                
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t"></div>
                    <span className="mx-4 text-xs uppercase text-muted-foreground">Or continue with</span>
                    <div className="flex-grow border-t"></div>
                </div>

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
              </CardContent>
              <CardFooter className="flex flex-col items-center">
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  Login
                </Button>
                <p className="mt-6 text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/register">
                       Register here <UserPlus className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}

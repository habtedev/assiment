"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Mail, 
  Lock, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Validation schemas with i18n keys
const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'validation.email.required')
    .email('validation.email.invalid')
    .regex(/^[a-zA-Z0-9._%+-]+@uog\.edu\.et$/, 'validation.email.university'),
  password: z
    .string()
    .min(1, 'validation.password.required')
    .min(6, 'validation.password.minLength'),
});

const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'validation.email.required')
    .email('validation.email.invalid')
    .regex(/^[a-zA-Z0-9._%+-]+@uog\.edu\.et$/, 'validation.email.university'),
});

type SignInFormValues = z.infer<typeof signInSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export interface SignInProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onResetPassword: (email: string) => Promise<void>;
  isLoading?: boolean;
  signInError?: string | null;
  resetPasswordSuccess?: boolean;
}

export default function SignIn({
  onSignIn,
  onResetPassword,
  isLoading = false,
  signInError = null,
  resetPasswordSuccess = false,
}: SignInProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<'signin' | 'reset'>('signin');

  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const resetPasswordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSignInSubmit = async (values: SignInFormValues) => {
    await onSignIn(values.email, values.password);
  };

  const onResetPasswordSubmit = async (values: ResetPasswordFormValues) => {
    await onResetPassword(values.email);
    resetPasswordForm.reset();
    toast({
      title: t('success.reset.title'),
      description: t('success.reset.description'),
    });
  };

  // Helper to get translated error messages
  const getErrorMessage = (key: string | string[]) => {
    const translation = t(Array.isArray(key) ? key[0] as any : key as any);
    return translation !== (Array.isArray(key) ? key[0] : key) ? translation : undefined;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs 
        defaultValue="signin" 
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'signin' | 'reset')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 p-1 mb-8 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl">
          <TabsTrigger 
            value="signin"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all"
          >
            {t('auth.signin.button')}
          </TabsTrigger>
          <TabsTrigger 
            value="reset"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all"
          >
            {t('auth.reset.title')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="mt-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {t('auth.signin.title')}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('auth.signin.subtitle')}
              </p>
            </div>

            <Form {...signInForm}>
              <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-5">
                <FormField
                  control={signInForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        {t('auth.email.label')}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder={t('auth.email.placeholder')}
                            type="email"
                            autoComplete="email"
                            autoFocus
                            disabled={isLoading}
                            className={cn(
                              "pl-10 h-11",
                              "bg-white dark:bg-slate-950",
                              "border-slate-200 dark:border-slate-800",
                              "focus:border-blue-500 focus:ring-blue-500",
                              "transition-all duration-200",
                              fieldState.error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                       <FormMessage className="text-xs text-red-600 dark:text-red-400">
                         {fieldState.error?.message ? getErrorMessage(fieldState.error.message) : null}
                       </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={signInForm.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          {t('auth.password.label')}
                        </FormLabel>
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-xs font-normal text-blue-600 dark:text-blue-400"
                          onClick={() => setActiveTab('reset')}
                        >
                          {t('auth.password.forgot')}
                        </Button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder={t('auth.password.placeholder')}
                            type="password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            className={cn(
                              "pl-10 h-11",
                              "bg-white dark:bg-slate-950",
                              "border-slate-200 dark:border-slate-800",
                              "focus:border-blue-500 focus:ring-blue-500",
                              "transition-all duration-200",
                              fieldState.error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                            )}
                            {...field}
                          />
                        </div>
                      </FormControl>
                       <FormMessage className="text-xs text-red-600 dark:text-red-400">
                         {fieldState.error?.message ? getErrorMessage(fieldState.error.message) : null}
                       </FormMessage>
                    </FormItem>
                  )}
                />

                {signInError && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/30">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-sm text-red-600 dark:text-red-400">
                      {signInError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className={cn(
                    "w-full h-11 text-base font-medium",
                    "bg-gradient-to-r from-blue-600 to-indigo-600",
                    "hover:from-blue-700 hover:to-indigo-700",
                    "text-white shadow-lg shadow-blue-500/25",
                    "transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('auth.signin.loading')}
                    </>
                  ) : (
                    t('auth.signin.button')
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="reset" className="mt-0">
          {resetPasswordSuccess ? (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t('auth.reset.sent')}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
                    {t('auth.reset.checkEmail')}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => setActiveTab('signin')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.back')}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {t('auth.reset.title')}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t('auth.reset.subtitle')}
                </p>
              </div>

              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(onResetPasswordSubmit)} className="space-y-5">
                  <FormField
                    control={resetPasswordForm.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          {t('auth.email.label')}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder={t('auth.email.placeholder')}
                              type="email"
                              autoComplete="email"
                              disabled={isLoading}
                              className={cn(
                                "pl-10 h-11",
                                "bg-white dark:bg-slate-950",
                                "border-slate-200 dark:border-slate-800",
                                "focus:border-blue-500 focus:ring-blue-500",
                                "transition-all duration-200",
                                fieldState.error && "border-red-500 focus:border-red-500 focus:ring-red-500"
                              )}
                              {...field}
                            />
                          </div>
                        </FormControl>
                         <FormMessage className="text-xs text-red-600 dark:text-red-400">
                           {fieldState.error?.message ? getErrorMessage(fieldState.error.message) : null}
                         </FormMessage>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col space-y-3 pt-2">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full h-11 border-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.sending')}
                        </>
                      ) : (
                        t('auth.reset.button')
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      onClick={() => setActiveTab('signin')}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      {t('common.back')}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('common.noAccount')}{' '}
          <Button 
            variant="link" 
            className="p-0 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
          >
            {t('common.contactAdmin')}
          </Button>
        </p>
      </div>
    </div>
  );
}
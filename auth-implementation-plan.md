# Authentication Implementation Plan

## Overview

This document outlines the implementation plan for authentication in our application, following Clean Architecture principles. The authentication flow will include:

1. Email-based OTP authentication
2. Google authentication
3. User management and session handling

## Authentication Flow

### Email OTP Authentication Flow

#### Signup Flow

1. User enters personal information (first name, last name, email)
2. Backend generates a 4-digit OTP and sends it to the user's email
3. User enters the OTP in the verification form
4. OTP is verified by the backend
5. Upon successful verification, user is authenticated and redirected to the dashboard

#### Login Flow

1. User enters email
2. Backend generates a 4-digit OTP and sends it to the user's email
3. User enters the OTP in the verification form
4. OTP is verified by the backend
5. Upon successful verification, user is authenticated and redirected to the dashboard

### Google Authentication Flow

1. User clicks on "Sign in with Google" button
2. Google OAuth flow is initiated
3. User authenticates with Google
4. Upon successful authentication, user is redirected back to our application
5. Backend verifies the Google authentication token
6. User is authenticated and redirected to the dashboard

## Folder Structure

Following the clean architecture folder structure:

```
src/
├── features/
│   └── auth/
│       ├── domain/
│       │   ├── entities/
│       │   │   └── OtpRequest.ts
│       │   ├── interfaces/
│       │   │   └── IAuthRepository.ts
│       │   └── errors/
│       │       └── AuthError.ts
│       │
│       ├── application/
│       │   ├── dtos/
│       │   │   ├── SignupDto.ts
│       │   │   ├── LoginDto.ts
│       │   │   ├── VerifyOtpDto.ts
│       │   │   ├── ResendOtpDto.ts
│       │   │   └── GoogleAuthDto.ts
│       │   ├── mappers/
│       │   │   └── AuthMapper.ts
│       │   └── useCases/
│       │       ├── SignupUseCase.ts
│       │       ├── LoginUseCase.ts
│       │       ├── VerifyOtpUseCase.ts
│       │       ├── ResendOtpUseCase.ts
│       │       └── GoogleAuthUseCase.ts
│       │
│       ├── infrastructure/
│       │   ├── api/
│       │   │   ├── AuthApiClient.ts
│       │   │   └── GoogleAuthClient.ts
│       │   └── repositories/
│       │       └── AuthRepository.ts
│       │
│       └── presentation/
│           ├── components/
│           │   ├── AuthForm.tsx
│           │   ├── EmailSignupForm.tsx
│           │   ├── EmailLoginForm.tsx
│           │   ├── OtpVerificationForm.tsx
│           │   ├── GoogleAuthButton.tsx
│           │   └── ResendOtpButton.tsx
│           ├── templates/
│           │   └── AuthTemplate.tsx
│           ├── hooks/
│           │   ├── useAuth.ts
│           │   ├── useOtpVerification.ts
│           │   └── useGoogleAuth.ts
│           └── utils/
│               └── authFormValidation.ts
│
├── pages/
│   └── index.tsx       # Landing page with auth forms
│
└── shared/
    ├── components/
    │   ├── atoms/      # Basic building blocks
    │   ├── molecules/  # Combinations of atoms
    │   └── organisms/  # Complex components
    ├── contexts/
    │   └── AuthContext.tsx
    └── hooks/
        └── useToast.ts
```

## Implementation Details

### Domain Layer

#### Entities

```typescript
// features/auth/domain/entities/OtpRequest.ts
export class OtpRequest {
  constructor(
    public readonly email: string,
    public readonly expiresAt: Date,
    public readonly attempts: number = 0,
    public readonly maxAttempts: number = 3,
    public readonly cooldownSeconds: number = 60
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  hasExceededMaxAttempts(): boolean {
    return this.attempts >= this.maxAttempts;
  }

  remainingCooldownSeconds(): number {
    const now = new Date();
    const cooldownEnd = new Date(now.getTime() + this.cooldownSeconds * 1000);
    const diff = cooldownEnd.getTime() - now.getTime();
    return Math.max(0, Math.floor(diff / 1000));
  }
}
```

#### Interfaces

```typescript
// features/auth/domain/interfaces/IAuthRepository.ts
export interface IAuthRepository {
  signup(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  login(email: string): Promise<{
    success: boolean;
    message: string;
  }>;

  verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    success: boolean;
    message: string;
  }>;

  resendOtp(email: string): Promise<{
    success: boolean;
    message: string;
    attemptsRemaining?: number;
    cooldownSeconds?: number;
  }>;

  authenticateWithGoogle(token: string): Promise<{
    success: boolean;
    message: string;
    isNewUser?: boolean;
  }>;

  refreshToken(): Promise<{
    success: boolean;
    message: string;
  }>;

  logout(): Promise<{
    success: boolean;
    message: string;
  }>;
}
```

### Application Layer

#### DTOs

```typescript
// features/auth/application/dtos/SignupDto.ts
export interface SignupInputDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignupOutputDto {
  success: boolean;
  email: string;
  message: string;
}

// features/auth/application/dtos/LoginDto.ts
export interface LoginInputDto {
  email: string;
}

export interface LoginOutputDto {
  success: boolean;
  email: string;
  message: string;
}

// features/auth/application/dtos/VerifyOtpDto.ts
export interface VerifyOtpInputDto {
  email: string;
  otp: string;
}

export interface VerifyOtpOutputDto {
  success: boolean;
  message: string;
}

// features/auth/application/dtos/ResendOtpDto.ts
export interface ResendOtpInputDto {
  email: string;
}

export interface ResendOtpOutputDto {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
  cooldownSeconds?: number;
}

// features/auth/application/dtos/GoogleAuthDto.ts
export interface GoogleAuthInputDto {
  token: string;
}

export interface GoogleAuthOutputDto {
  success: boolean;
  message: string;
  isNewUser?: boolean;
}
```

#### Use Cases

```typescript
// features/auth/application/useCases/SignupUseCase.ts
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { SignupInputDto, SignupOutputDto } from '../dtos/SignupDto';

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: SignupInputDto): Promise<SignupOutputDto> {
    try {
      const response = await this.authRepository.signup(
        input.email,
        input.firstName,
        input.lastName
      );

      return {
        success: true,
        email: input.email,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        email: input.email,
        message: error.message || 'Failed to initiate signup',
      };
    }
  }
}

// features/auth/application/useCases/LoginUseCase.ts
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { LoginInputDto, LoginOutputDto } from '../dtos/LoginDto';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: LoginInputDto): Promise<LoginOutputDto> {
    try {
      const response = await this.authRepository.login(input.email);

      return {
        success: true,
        email: input.email,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        email: input.email,
        message: error.message || 'Failed to initiate login',
      };
    }
  }
}

// features/auth/application/useCases/VerifyOtpUseCase.ts
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { VerifyOtpInputDto, VerifyOtpOutputDto } from '../dtos/VerifyOtpDto';

export class VerifyOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: VerifyOtpInputDto): Promise<VerifyOtpOutputDto> {
    try {
      const response = await this.authRepository.verifyOtp(input.email, input.otp);

      return {
        success: true,
        message: response.message || 'Authentication successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to verify OTP',
      };
    }
  }
}

// features/auth/application/useCases/ResendOtpUseCase.ts
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { ResendOtpInputDto, ResendOtpOutputDto } from '../dtos/ResendOtpDto';

export class ResendOtpUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: ResendOtpInputDto): Promise<ResendOtpOutputDto> {
    try {
      const response = await this.authRepository.resendOtp(input.email);

      return {
        success: true,
        message: response.message || 'OTP resent successfully',
        attemptsRemaining: response.attemptsRemaining,
        cooldownSeconds: response.cooldownSeconds,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to resend OTP',
      };
    }
  }
}

// features/auth/application/useCases/GoogleAuthUseCase.ts
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { GoogleAuthInputDto, GoogleAuthOutputDto } from '../dtos/GoogleAuthDto';

export class GoogleAuthUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(input: GoogleAuthInputDto): Promise<GoogleAuthOutputDto> {
    try {
      const response = await this.authRepository.authenticateWithGoogle(input.token);

      return {
        success: true,
        message: response.message || 'Google authentication successful',
        isNewUser: response.isNewUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Google authentication failed',
      };
    }
  }
}
```

### Infrastructure Layer

#### API Clients

```typescript
// features/auth/infrastructure/api/AuthApiClient.ts
import { httpService, HttpError } from '@/shared/services';

interface AuthResponse {
  success: boolean;
  message: string;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

interface ResendOtpResponse {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
  cooldownSeconds?: number;
}

export class AuthApiClient {
  private baseUrl = '/auth'; // Auth API path

  async signup(email: string, firstName: string, lastName: string): Promise<AuthResponse> {
    try {
      const response = await httpService.post<AuthResponse>(
        `${this.baseUrl}/signup`,
        { email, firstName, lastName },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to signup');
      }
      throw error;
    }
  }

  async login(email: string): Promise<AuthResponse> {
    try {
      const response = await httpService.post<AuthResponse>(
        `${this.baseUrl}/login`,
        { email },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to login');
      }
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse> {
    try {
      const response = await httpService.post<VerifyOtpResponse>(
        `${this.baseUrl}/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to verify OTP');
      }
      throw error;
    }
  }

  async resendOtp(email: string): Promise<ResendOtpResponse> {
    try {
      const response = await httpService.post<ResendOtpResponse>(
        `${this.baseUrl}/resend-otp`,
        { email },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to resend OTP');
      }
      throw error;
    }
  }

  async refreshToken(): Promise<VerifyOtpResponse> {
    try {
      const response = await httpService.post<VerifyOtpResponse>(
        `${this.baseUrl}/refresh-token`,
        {},
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to refresh token');
      }
      throw error;
    }
  }

  async logout(): Promise<VerifyOtpResponse> {
    try {
      const response = await httpService.post<VerifyOtpResponse>(
        `${this.baseUrl}/logout`,
        {},
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Failed to logout');
      }
      throw error;
    }
  }
}
```

#### Repositories

```typescript
// features/auth/infrastructure/repositories/AuthRepository.ts
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { AuthApiClient } from '../api/AuthApiClient';
import { GoogleAuthClient } from '../api/GoogleAuthClient';

export class AuthRepository implements IAuthRepository {
  private authApiClient: AuthApiClient;
  private googleAuthClient: GoogleAuthClient;

  constructor() {
    this.authApiClient = new AuthApiClient();
    this.googleAuthClient = new GoogleAuthClient();
  }

  async signup(
    email: string,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.authApiClient.signup(email, firstName, lastName);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
  }

  async login(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.authApiClient.login(email);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.authApiClient.verifyOtp(email, otp);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
  }

  async resendOtp(email: string): Promise<{
    success: boolean;
    message: string;
    attemptsRemaining?: number;
    cooldownSeconds?: number;
  }> {
    try {
      const response = await this.authApiClient.resendOtp(email);

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
        attemptsRemaining: response.attemptsRemaining,
        cooldownSeconds: response.cooldownSeconds,
      };
    } catch (error) {
      throw error;
    }
  }

  async authenticateWithGoogle(
    token: string
  ): Promise<{ success: boolean; message: string; isNewUser?: boolean }> {
    try {
      const response = await this.googleAuthClient.authenticate(token);

      if (!response.success) {
        throw new Error(response.message || 'Google authentication failed');
      }

      return {
        success: true,
        message: response.message,
        isNewUser: response.isNewUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.authApiClient.refreshToken();

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.authApiClient.logout();

      if (!response.success) {
        throw new Error(response.message);
      }

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      throw error;
    }
  }
}
```

### Presentation Layer

#### Components

For the OTP verification form and resend functionality, we'll implement the following components:

```tsx
// features/auth/presentation/components/OtpVerificationForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/components/atoms/button';
import { FormItem, FormLabel, FormMessage } from '@/shared/components/atoms/form';
import { OtpInput } from '@/shared/components/molecules/otpInput';
import { ResendOtpButton } from './ResendOtpButton';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/shared/hooks/useToast';

const otpSchema = z.object({
  otp: z.string().length(4, 'Please enter a 4-digit OTP'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpVerificationFormProps {
  email: string;
}

export function OtpVerificationForm({ email }: OtpVerificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyOtp, resendOtp } = useAuth();
  const { toast } = useToast();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const handleSubmit = async (data: OtpFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await verifyOtp(email, data.otp);

      if (result.success) {
        toast.success(result.message || 'Authentication successful');
        // Redirect or further action handled by auth context
      } else {
        toast.error(result.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      const result = await resendOtp(email);
      if (result.success) {
        toast.success(result.message || 'OTP resent successfully');
        return {
          success: true,
          attemptsRemaining: result.attemptsRemaining,
          cooldownSeconds: result.cooldownSeconds || 60,
        };
      } else {
        toast.error(result.message || 'Failed to resend OTP');
        return {
          success: false,
          cooldownSeconds: result.cooldownSeconds,
        };
      }
    } catch (error) {
      toast.error('Failed to resend OTP');
      return { success: false };
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <FormItem>
        <FormLabel>Enter the 4-digit code sent to your email</FormLabel>
        <OtpInput
          value={form.watch('otp')}
          onChange={value => form.setValue('otp', value, { shouldValidate: true })}
          length={4}
          disabled={isSubmitting}
        />
        <FormMessage>{form.formState.errors.otp?.message}</FormMessage>
      </FormItem>

      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        Verify OTP
      </Button>

      <div className="mt-4 text-center">
        <ResendOtpButton onResend={handleResend} />
      </div>
    </form>
  );
}
```

```tsx
// features/auth/presentation/components/GoogleAuthButton.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/atoms/button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '@/shared/hooks/useToast';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
}

export function GoogleAuthButton({ onSuccess }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { authenticateWithGoogle } = useAuth();
  const { toast } = useToast();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.google && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
    }
  }, [window.google, clientId]);

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    try {
      const result = await authenticateWithGoogle(response.credential);

      if (result.success) {
        toast.success(result.message || 'Google authentication successful');
        onSuccess?.();
      } else {
        toast.error(result.message || 'Google authentication failed');
      }
    } catch (error) {
      toast.error('Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google authentication service is not available');
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <svg
        className="mr-2 h-4 w-4"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        />
      </svg>
      {isLoading ? 'Authenticating...' : 'Sign in with Google'}
    </Button>
  );
}
```

#### Hooks

To manage OTP resend functionality with proper cooldown and attempt limiting:

```tsx
// features/auth/presentation/hooks/useOtpResend.ts
import { useState, useEffect } from 'react';

interface UseOtpResendOptions {
  cooldownPeriod?: number;
  maxAttempts?: number;
}

export function useOtpResend({ cooldownPeriod = 60, maxAttempts = 3 }: UseOtpResendOptions = {}) {
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isInCooldown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(current => current - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsInCooldown(false);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown, isInCooldown]);

  const trackResendAttempt = () => {
    setAttempts(current => current + 1);
    setCountdown(cooldownPeriod);
    setIsInCooldown(true);
  };

  const canResend = !isInCooldown && attempts < maxAttempts;
  const attemptsLeft = maxAttempts - attempts;

  return {
    countdown,
    attempts,
    attemptsLeft,
    isInCooldown,
    canResend,
    trackResendAttempt,
  };
}
```

For error handling in the auth hook, following the project's error handling guidelines:

```tsx
// features/auth/presentation/hooks/useAuth.ts (excerpt)
import { useContext } from 'react';
import { AuthContext } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/hooks/useToast';

export function useAuth() {
  const context = useContext(AuthContext);
  const { toast } = useToast();

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Handle OTP resend with proper error handling
  const handleResendOtp = async (otpId: string) => {
    try {
      const result = await context.resendOtp(otpId);
      return result;
    } catch (error) {
      // API errors shown as toast notifications
      toast.error(`Failed to resend OTP: ${error.message}`);
      throw error;
    }
  };

  return {
    // ...other auth methods
    resendOtp: handleResendOtp,
  };
}
```

This implementation of the OTP verification components follows the project's architectural rules, including:

1. Using shadcn/ui components from the shared atom/molecule structure
2. Implementing proper error handling with toast notifications for API errors
3. Following the single responsibility principle with small, focused components
4. Managing state with custom hooks that encapsulate specific behaviors

## E2E Testing with Playwright

Following the project's testing standards, we'll implement E2E tests for the authentication flow:

```typescript
// features/auth/e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to sign up with email OTP', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Fill sign up form
    await page.fill('input[id="firstName"]', 'John');
    await page.fill('input[id="lastName"]', 'Doe');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Verify we've moved to OTP verification screen
    await expect(page.locator('text=Enter the 4-digit code')).toBeVisible();

    // Fill OTP (mocked in test environment)
    await page.fill('input[id="otp-0"]', '1');
    await page.fill('input[id="otp-1"]', '2');
    await page.fill('input[id="otp-2"]', '3');
    await page.fill('input[id="otp-3"]', '4');
    await page.click('button[type="submit"]');

    // Verify successful login
    await expect(page.locator('text=Authentication successful')).toBeVisible();
  });

  test('should handle OTP resend with cooldown', async ({ page }) => {
    // Navigate to OTP verification (following signup)
    await page.goto('/');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // First click on resend should work
    await page.click('button:text("Resend OTP")');
    await expect(page.locator('text=OTP resent successfully')).toBeVisible();

    // Button should be disabled with countdown
    await expect(page.locator('button:text("Resend OTP")')).toBeDisabled();

    // Wait for cooldown to expire (mocked in tests)
    await page.evaluate(() => {
      window.mockExpireCooldown();
    });

    // Should be able to click again
    await expect(page.locator('button:text("Resend OTP")')).toBeEnabled();
  });

  test('should prevent more than 3 resend attempts', async ({ page }) => {
    // Navigate to OTP verification
    await page.goto('/');
    await page.fill('input[id="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // Use up all 3 attempts with helper function to bypass cooldown
    for (let i = 0; i < 3; i++) {
      await page.click('button:text("Resend OTP")');
      // Mock expiring the cooldown immediately for testing
      await page.evaluate(() => {
        window.mockExpireCooldown();
      });
    }

    // Verify button is disabled and shows maximum attempts message
    await expect(page.locator('text=Maximum resend attempts reached')).toBeVisible();
    await expect(page.locator('button:text("Maximum resend attempts reached")')).toBeDisabled();
  });

  test('should toggle between signup and login modes', async ({ page }) => {
    await page.goto('/');

    // Should start with signup form (firstname, lastname visible)
    await expect(page.locator('input[id="firstName"]')).toBeVisible();
    await expect(page.locator('input[id="lastName"]')).toBeVisible();

    // Click login toggle
    await page.click('button:text("Already have an account?")');

    // Should now show login form (only email visible)
    await expect(page.locator('input[id="firstName"]')).not.toBeVisible();
    await expect(page.locator('input[id="lastName"]')).not.toBeVisible();
    await expect(page.locator('input[id="email"]')).toBeVisible();

    // Toggle back to signup
    await page.click('button:text("Need to create an account?")');

    // Should show signup form again
    await expect(page.locator('input[id="firstName"]')).toBeVisible();
    await expect(page.locator('input[id="lastName"]')).toBeVisible();
  });

  test('should handle Google authentication', async ({ page }) => {
    await page.goto('/');

    // Mock Google auth flow
    await page.evaluate(() => {
      window.mockGoogleAuth = true;
    });

    // Click Google auth button
    await page.click('button:text("Sign in with Google")');

    // Verify success
    await expect(page.locator('text=Authentication successful')).toBeVisible();
  });
});
```

These tests cover:

1. The complete signup flow with OTP verification
2. OTP resend functionality with cooldown
3. The 3-attempt limitation for OTP resends
4. Toggling between signup and login modes
5. Google authentication flow

We'll use test environment mocks for:

- Backend API responses
- Cooldown timer manipulation
- Google OAuth flow

## External API Endpoints

The following endpoints need to be implemented in the external backend:

1. **Signup with OTP**

   - Endpoint: `POST /api/auth/signup`
   - Payload: `{ email, firstName, lastName }`
   - Response: `{ success: boolean, message: string }`
   - Purpose: Registers a new user and sends a 4-digit OTP to the user's email

2. **Login with OTP**

   - Endpoint: `POST /api/auth/login`
   - Payload: `{ email }`
   - Response: `{ success: boolean, message: string }`
   - Purpose: Initiates login for an existing user by sending a 4-digit OTP to their email

3. **Request OTP**

   - Endpoint: `POST /api/auth/otp/request`
   - Payload: `{ email, firstName?, lastName? }`
   - Response: `{ success: boolean, message: string, otpId: string }`
   - Purpose: Generates and sends a 4-digit OTP to the user's email

4. **Verify OTP**

   - Endpoint: `POST /api/auth/otp/verify`
   - Payload: `{ otpId: string, otp: string }`
   - Response: `{ success: boolean, token: string, user: User }`
   - Purpose: Verifies the OTP entered by user and returns authentication token

5. **Resend OTP**

   - Endpoint: `POST /api/auth/otp/resend`
   - Payload: `{ otpId: string }`
   - Response: `{ success: boolean, message: string, otpId: string }`
   - Purpose: Regenerates and resends OTP to user's email when requested

6. **Google Authentication**
   - Endpoint: `POST /api/auth/google`
   - Payload: `{ token: string }` (ID token from Google)
   - Response: `{ success: boolean, token: string, user: User }`
   - Purpose: Verifies Google ID token and returns authentication token

```typescript
// features/auth/infrastructure/api/GoogleAuthClient.ts
import { httpService, HttpError } from '@/shared/services';

interface GoogleAuthResponse {
  success: boolean;
  message: string;
  isNewUser?: boolean;
}

export class GoogleAuthClient {
  private baseUrl = '/auth';

  async authenticate(idToken: string): Promise<GoogleAuthResponse> {
    try {
      const response = await httpService.post<GoogleAuthResponse>(
        `${this.baseUrl}/google`,
        { token: idToken },
        { withCredentials: true }
      );

      return response.data;
    } catch (error) {
      if (error instanceof HttpError) {
        throw new Error(error.data?.message || 'Google authentication failed');
      }
      throw error;
    }
  }
}
```

## Shared Services Integration

### HttpService Configuration

To properly integrate the shared HttpService with our authentication feature, we'll need to initialize it at application startup:

```typescript
// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { httpService } from '@/shared/services';
import { AuthProvider } from '@/shared/contexts/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  // Configure the HttpService on app initialization
  useEffect(() => {
    // Set the base URL for the API
    httpService.setBaseUrl(process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com');

    // Set default headers if needed
    httpService.setDefaultHeaders({
      'Accept-Language': navigator.language,
      // Other default headers
    });

    // Optional: Add request/response interceptors for auth token refresh
  }, []);

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
```

### Authentication Token Management

We'll enhance the AuthContext to manage authentication tokens and integrate with HttpService:

```typescript
// shared/contexts/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import { httpService } from '@/shared/services';
import { useRouter } from 'next/router';
import { AuthRepository } from '@/features/auth/infrastructure/repositories/AuthRepository';

interface User {
  email: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signup: (email: string, firstName: string, lastName: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  login: (email: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  verifyOtp: (email: string, otp: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  resendOtp: (email: string) => Promise<{
    success: boolean;
    message: string;
    attemptsRemaining?: number;
    cooldownSeconds?: number;
  }>;
  authenticateWithGoogle: (token: string) => Promise<{
    success: boolean;
    message: string;
    isNewUser?: boolean;
  }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const authRepository = new AuthRepository();

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Make a test request to an authenticated endpoint
        await httpService.get('/auth/check', { withCredentials: true });
        // If request succeeds, user is authenticated
        setIsAuthenticated(true);
        setUser({ email: '', isAuthenticated: true }); // Basic auth state
      } catch (error) {
        // If request fails with 401, user is not authenticated
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Set up interceptors to handle token refresh
  useEffect(() => {
    const interceptorId = httpService.setupInterceptors(
      // onResponseError
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and not from the auth endpoint and not already retried
        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/')) {

          originalRequest._retry = true;

          try {
            // Try to refresh the token
            await authRepository.refreshToken();
            // Retry the original request
            return httpService.request(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            setIsAuthenticated(false);
            setUser(null);
            router.push('/');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      httpService.removeInterceptor(interceptorId);
    };
  }, [router]);

  const signup = async (email: string, firstName: string, lastName: string) => {
    return await authRepository.signup(email, firstName, lastName);
  };

  const login = async (email: string) => {
    return await authRepository.login(email);
  };

  const verifyOtp = async (email: string, otp: string) => {
    const response = await authRepository.verifyOtp(email, otp);

    if (response.success) {
      // After successful OTP verification, user is authenticated
      setIsAuthenticated(true);
      setUser({ email, isAuthenticated: true });
    }

    return response;
  };

  const resendOtp = async (email: string) => {
    return await authRepository.resendOtp(email);
  };

  const authenticateWithGoogle = async (token: string) => {
    const response = await authRepository.authenticateWithGoogle(token);

    if (response.success) {
      // After successful Google auth, user is authenticated
      setIsAuthenticated(true);
      setUser({ email: '', isAuthenticated: true }); // We don't have email info
    }

    return response;
  };

  const logout = async () => {
    try {
      await authRepository.logout();
      setIsAuthenticated(false);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signup,
        login,
        verifyOtp,
        resendOtp,
        authenticateWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
```

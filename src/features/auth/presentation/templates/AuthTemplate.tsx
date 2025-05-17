import { ReactNode } from 'react';

interface AuthTemplateProps {
  children: ReactNode;
}

export const AuthTemplate = ({ children }: AuthTemplateProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img className="h-12 w-auto" src="/logo.svg" alt="Logo" />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card text-card-foreground py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  );
};

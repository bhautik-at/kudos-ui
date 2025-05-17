import React from 'react';
import { NextPage } from 'next';
import { useToast } from '@/shared/hooks/use-toast';
import { toastService } from '@/shared/services/toast';

const HomePage: NextPage = () => {
  const { success, error, info, warning } = useToast();

  const showToastExamples = () => {
    success('Success', 'Operation completed successfully');

    setTimeout(() => {
      error('Error', 'Something went wrong');
    }, 1000);

    setTimeout(() => {
      info('Info', 'Here is some information for you');
    }, 2000);

    setTimeout(() => {
      warning('Warning', 'Please take caution');
    }, 3000);
  };

  const showServiceToast = () => {
    // This is an example of using the service directly
    toastService.success('Success from Service', 'This toast was triggered from the service');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-4xl font-bold mb-6">Toast Example</h1>

        <div className="flex flex-col space-y-4">
          <button
            onClick={showToastExamples}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Show Toast Examples
          </button>

          <button
            onClick={showServiceToast}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Show Service Toast
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

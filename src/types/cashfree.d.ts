
declare global {
  interface Window {
    Cashfree: (config: { mode: string }) => {
      checkout: (options: {
        paymentSessionId: string;
        returnUrl?: string;
      }) => Promise<{
        error?: { message: string };
        redirect?: boolean;
        paymentDetails?: any;
      }>;
    };
  }
}

export {};

import { useState } from 'react';
import { fetchApi } from '@/lib/api';
import type { PricingPlan } from '@/lib/types';

interface PaymentIntent {
  clientSecret: string;
}

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (plan: PricingPlan, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi<PaymentIntent>('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId,
        }),
      });

      return data.clientSecret;
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to initialize payment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPaymentIntent,
    loading,
    error,
  };
}
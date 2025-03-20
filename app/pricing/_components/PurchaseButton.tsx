'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/app/actions/createCheckoutSession';

interface PurchaseButtonProps {
  userId: string;
}

export default function PurchaseButton({ userId }: PurchaseButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handlePurchase = () => {
    startTransition(async () => {
      try {
        const checkoutUrl = await createCheckoutSession(userId);
        router.push(checkoutUrl);
      } catch (error) {
        console.error('Purchase initiation failed:', error);
      }
    });
  };

  return (
    <button onClick={handlePurchase} disabled={isPending}>
      {isPending ? 'Processing...' : 'Buy Now'}
    </button>
  );
}
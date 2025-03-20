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
    <button onClick={handlePurchase} disabled={isPending} className="bg-[#DDFF00] font-satoshi-medium text-black text-sm px-6 py-4 rounded-md hover:bg-[#DDFF02] transition-colors flex gap-2 shadow-neon-green">
      {isPending ? 'Processing...' : 'Upgrade to Lifetime'}
    </button>
  );
}
'use server';

import axios from 'axios';

const CREEM_API_KEY = process.env.CREEM_API_KEY; // Ensure this is set in your environment variables
const PRODUCT_ID = process.env.CREEM_PRODUCT_ID; // Replace with your actual product ID

export async function createCheckoutSession(userId: string): Promise<string> {
  try {
    const response = await axios.post(
      process.env.CREEM_PAYMENT_LINK!,
      {
        product_id: PRODUCT_ID,
        request_id: userId, // Use userId to track the payment
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
        // success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/updateProStatus?request_id=${userId}`,
      },
      {
        headers: { 'x-api-key': CREEM_API_KEY },
      }
    );

    const { checkout_url } = response.data;
    return checkout_url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}
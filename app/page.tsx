'use client';

import ImageGenerator from '@/components/ImageGenerator';
import { Zap } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Home() {

  return (
    <main className="min-h-screen mx-auto pb-12">
      <Header />
      <div className="container px-4 py-12">
        <div className="container px-0 md:px-6 pt-12 pb-12 text-center relative z-20">
          <div className="inline-block mb-6">
              <span className="bg-[#e1ff00]/10 text-[#e1ff00] px-4 py-2 rounded-full text-sm font-satoshi-bold z-20">
                #1 Productivity Software
              </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-satoshi-bold mb-8 leading-tight text-white">
            Unlimited <span className="text-gray-500">AI Image</span>
            <br />
            Generation with Snapzion
          </h1>

          <p className="text-xm md:text-xl text-[#747474] mx-auto mb-12 font-satoshi-regular">
          Snapzion lets you create limitless, high-quality images with the power of AI. Unleash your creativity and generate visuals in seconds, all without any design skills required.
          </p>

          <div className="flex flex-col items-center space-y-4">
            <Link href="/pricing" passHref style={{scrollBehavior:'smooth'}}>
              <button className="bg-[#e1ff00] hover:bg-[#DDFF02] text-black px-8 py-3 rounded-md font-medium hover:bg-[#c8e600] transition-colors flex items-center space-x-2 relative z-20">
                <Zap className="w-5 h-5" />
                <span>Purchase for Lifetime</span>
              </button>
            </Link>
            <span className="text-sm text-gray-500">$5 one-time, a cost of coffee</span>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-[#e1ff00]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-gray-400 text-sm">1.7k+ rating on Product Hunt</span>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-[#e1ff00]/30 rounded-full filter blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-[#e1ff00]/30 rounded-full filter blur-[100px] opacity-20"></div>
          </div>
        </div>
      </div>
      <div id="image-generator">
      <ImageGenerator />
      </div>
    </main>
  );
}
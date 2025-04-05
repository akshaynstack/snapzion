import { Zap, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { PersonFilledIcon } from '@shopify/polaris-icons';

export default function Header() {

    return (
        <>
            <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Zap className="w-6 h-6 text-[#DDFF00]" />
                    <Link href="/"><span className="text-[22px] font-satoshi-bold text-white">Snapzion</span></Link>
                </div>
                <div className='flex gap-8 items-center'>
                    <SignedOut>
                    <SignInButton mode="modal">
                        <button className="bg-[#DDFF00] font-semibold text-black text-sm px-4 py-2 rounded-md hover:bg-[#DDFF02] transition-colors flex gap-2 shadow-neon-green">
                            <PersonFilledIcon className="w-5 h-5 text-black" />Sign Up
                        </button>
                    </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <SignOutButton>
                            <button className="bg-[#DDFF00] font-semibold text-black text-sm px-4 py-2 rounded-md hover:bg-[#DDFF02] transition-colors flex gap-2 shadow-neon-green">
                                <LogOut className="w-5 h-5 text-black" />Logout
                            </button>
                        </SignOutButton>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>
        </>
    )
}
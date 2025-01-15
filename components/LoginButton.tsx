import { SignInButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function LoginButton() {
  return (
    <SignInButton mode="modal">
      <button className="bg-[#DDFF00] font-satoshi-medium text-black text-sm px-4 py-2 rounded-md hover:bg-[#DDFF02] transition-colors flex gap-2 shadow-neon-green">
        <User className="w-5 h-5 text-black" />Login
    </button>
    </SignInButton>
  );
}
export default LoginButton;
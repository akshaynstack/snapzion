import { Zap } from "lucide-react";
import Link from "next/link";

export default function UpgradeButton() {
  const CHEKOUT_URL =
    "https://fluxaicode.lemonsqueezy.com/buy/a00e43a1-9d82-4000-bbaa-dbda34aef4b4";

  return (
    <Link
      href={CHEKOUT_URL}
      className="bg-[#DDFF00] font-satoshi-medium text-black text-sm px-6 py-4 rounded-md hover:bg-[#DDFF02] transition-colors flex gap-2 shadow-neon-green"
    >
      <Zap className="w-5 h-5" />
      Upgrade to Lifetime
    </Link>
  );
}
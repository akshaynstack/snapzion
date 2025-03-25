// 'use client';

// import { useState } from "react";
// import Header from "@/components/Header";

// export default function RedeemCode() {
//   const [email, setEmail] = useState("");
//   const [code, setCode] = useState("");

//   const redeem = async () => {
//     const res = await fetch("/api/redeem", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ code, email }), // ✅ Send email along with the code
//     });

//     const data = await res.json();
//     alert(data.success ? "Redeemed successfully!" : `Error: ${data.error}`);
//   };

//   return (
//     <div className="space-y-6 max-w-6xl mx-auto">
//       <Header />
//       <input
//         type="email"
//         placeholder="Enter Your Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="Enter Redeem Code"
//         value={code}
//         onChange={(e) => setCode(e.target.value)}
//       />
//       <button onClick={redeem}>Redeem</button>
//     </div>
//   );
// }
'use client';

import { useState } from "react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast} from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RedeemCode() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const redeem = async () => {
    const res = await fetch("/api/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, email }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage({ text: "Success: Redeemed successfully!", type: "success" });

      // Hide success message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } else {
      setMessage({ text: `Error: ${data.error}`, type: "error" });
    }
  };

  return (
    <>
    <Header />
    <div className="flex flex-col items-center justify-center p-6 md:p-16 mx-auto my-auto max-w-6xl">
      <Card className="w-full max-w-md p-2 md:p-8 bg-white shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Redeem Your Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
          <Input
            type="text"
            placeholder="Enter Redeem Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full"
          />
          <Button onClick={redeem} className="w-full bg-[#DDFF00] font-satoshi-bold text-black text-sm px-4 py-2 rounded-md hover:bg-[#DDFF02] transition-colors flex gap-2 shadow-black">
            Redeem
          </Button>
          {message && (
            <p
              className={`text-center mt-2 font-medium ${
                message.type === "success" ? "text-green-600" : "text-red-500"
              }`}
            >
              {message.text}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
}
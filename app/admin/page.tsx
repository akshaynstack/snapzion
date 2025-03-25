// "use client";

// import { useState } from "react";
// import { toast } from "sonner";
// import Header from "@/components/Header";

// export default function GenerateCode() {
//   const [secret, setSecret] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [generatedCode, setGeneratedCode] = useState("");

//   const generateCode = async () => {
//     if (!secret) return toast.error("Enter the secret key!");

//     setLoading(true);
//     const response = await fetch("/api/generatecode", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ secret }),
//     });

//     const data = await response.json();
//     setLoading(false);

//     if (!response.ok) return toast.error(data.error);

//     setGeneratedCode(data.code);
//     toast.success("Redeem code generated!");
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-6">
//       <Header />
//       <input
//         type="text"
//         placeholder="Enter Secret Key"
//         value={secret}
//         onChange={(e) => setSecret(e.target.value)}
//         className="p-2 border rounded"
//       />
//       <button
//         onClick={generateCode}
//         disabled={loading}
//         className="px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         {loading ? "Generating..." : "Generate Code"}
//       </button>
//       {generatedCode && (
//         <p className="mt-4 text-green-500 font-bold">Code: {generatedCode}</p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";

export default function GenerateCode() {
  const [secret, setSecret] = useState("");
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);

  const generateCode = async () => {
    if (!secret) return toast.error("Enter the secret key!");
    if (count <= 0) return toast.error("Enter a valid number of codes!");

    setLoading(true);
    const response = await fetch("/api/generatecode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, count }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) return toast.error(data.error);

    setGeneratedCodes(data.codes);
    toast.success(`${count} Redeem Codes Generated!`);
  };

  const downloadCSV = () => {
    if (generatedCodes.length === 0) return toast.error("No codes to download!");

    const csvContent = "data:text/csv;charset=utf-8," +
      ["Code", ...generatedCodes].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "redeem_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Header />
      <input
        type="text"
        placeholder="Enter Secret Key"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Number of Codes"
        value={count}
        min="1"
        onChange={(e) => setCount(Number(e.target.value))}
        className="p-2 border rounded"
      />
      <button
        onClick={generateCode}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Generating..." : "Generate Codes"}
      </button>

      {generatedCodes.length > 0 && (
        <>
          <p className="mt-4 text-green-500 font-bold">
            {generatedCodes.length} Codes Generated!
          </p>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Download CSV
          </button>
        </>
      )}
    </div>
  );
}
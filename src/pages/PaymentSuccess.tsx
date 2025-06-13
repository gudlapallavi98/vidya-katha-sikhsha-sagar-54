import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [status, setStatus] = useState("Verifying your payment...");
  const [error, setError] = useState("");

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");

    if (!orderId) {
      setError("Missing order ID in URL.");
      return;
    }

    fetch(`https://nxdsszdobgbikrnqqrue.functions.supabase.co/verify-payment?order_id=${orderId}`)
  .then(async (res) => {
    const contentType = res.headers.get("Content-Type");
    if (!res.ok || !contentType?.includes("application/json")) {
      const errorText = await res.text();
      throw new Error("Invalid response: " + errorText);
    }
    return res.json();
  })
  .then((data) => {
    if (data.verified) {
      setStatus("✅ Payment verified! Redirecting...");
      setTimeout(() => {
        window.location.href = "/session-confirmation";
      }, 3000);
    } else {
      throw new Error("Payment could not be verified.");
    }
  })
  .catch((err) => setError(err.message || "Something went wrong."));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <h1 className="text-2xl font-bold mb-2">🔔 Payment Status</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-green-600">{status}</p>
      )}
    </div>
  );
}

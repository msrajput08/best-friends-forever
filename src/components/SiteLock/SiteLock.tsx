import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SiteLock({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const unlock = async () => {
    setLoading(true);
    setError("");

    const { data, error } = await supabase.functions.invoke(
      "verify-password",
      {
        body: {
          password,
        },
      }
    );

    setLoading(false);

    if (error || !data?.success) {
      setError("Wrong Password");
      return;
    }

    sessionStorage.setItem("siteUnlocked", "true");

    onUnlock();
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="space-y-4 w-80">

        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Enter Password"
          className="w-full border p-3 rounded"
        />

        <button
          onClick={unlock}
          disabled={loading}
          className="w-full p-3 bg-amber-500 rounded"
        >
          {loading ? "Checking..." : "Unlock"}
        </button>

        <p className="text-red-500">
          {error}
        </p>

      </div>
    </div>
  );
}
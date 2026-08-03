import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SiteLock({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    console.log("FUNCTION DATA:", data);
    console.log("FUNCTION ERROR:", error);

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

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full border p-3 rounded pr-12"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

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
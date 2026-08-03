import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { password } = await req.json();

  const realPassword = Deno.env.get("SITE_PASSWORD");

  if (password === realPassword) {
    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: false,
    }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
});
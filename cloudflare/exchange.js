// exchange.js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response(JSON.stringify({ error: "missing_code" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client_id = "Ov23liqsljSBAqajz2eu"; // ⚙️ GitHub Client ID
    const client_secret = "ff98bc67ded5bcd60684312c69c08525bb2cac35"; // ⚙️ GitHub Client Secret (절대 노출 금지)

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({ client_id, client_secret, code }),
    });

    const tokenData = await tokenRes.json();

    return new Response(JSON.stringify(tokenData), {
      headers: {
        "Access-Control-Allow-Origin": "https://blog.gofunwith.com",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
    });
  },
};

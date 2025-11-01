/* cloudflare_worker.js v1.0.0_202510221638 */

/*
 * Cloudflare Worker: GitHub OAuth Access Token Exchange
 *
 * 이 워커의 유일한 목적은 GitHub OAuth의 'code'를 'access_token'으로 교환하는 것입니다.
 * GitHub OAuth App의 Client Secret을 안전하게 보관하기 위해 사용됩니다.
 *
 * 필수 환경 변수 (Worker Secrets):
 * - GITHUB_CLIENT_ID: GitHub OAuth App의 Client ID
 * - GITHUB_CLIENT_SECRET: GitHub OAuth App의 Client Secret
 * - ALLOWED_ORIGIN: CORS를 허용할 Admin 페이지의 Origin (예: https://blog.gofunwith.com)
 */

export default {
  async fetch(request, env) {
    // CORS Preflight (OPTIONS) 요청 처리
    if (request.method === 'OPTIONS') {
      return handleOptions(request, env);
    }

    // POST 요청만 허용
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: corsHeaders(env.ALLOWED_ORIGIN),
      });
    }

    // POST 요청 처리
    try {
      const { code } = await request.json();

      if (!code) {
        return new Response(JSON.stringify({ error: 'No code provided' }), {
          status: 400,
          headers: {
            ...corsHeaders(env.ALLOWED_ORIGIN),
            'Content-Type': 'application/json',
          },
        });
      }

      // GitHub API로 access_token 요청
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const data = await response.json();

      if (data.error) {
        return new Response(JSON.stringify(data), {
          status: 400,
          headers: {
            ...corsHeaders(env.ALLOWED_ORIGIN),
            'Content-Type': 'application/json',
          },
        });
      }

      // 성공 시 access_token 반환
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...corsHeaders(env.ALLOWED_ORIGIN),
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          ...corsHeaders(env.ALLOWED_ORIGIN),
          'Content-Type': 'application/json',
        },
      });
    }
  },
};

// CORS 헤더 생성
function corsHeaders(allowedOrigin) {
  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// OPTIONS 요청 핸들러
function handleOptions(request, env) {
  const headers = request.headers;
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // CORS Preflight 응답
    return new Response(null, {
      headers: corsHeaders(env.ALLOWED_ORIGIN),
    });
  } else {
    // 일반 OPTIONS 요청
    return new Response(null, {
      headers: {
        Allow: 'POST, OPTIONS',
      },
    });
  }
}

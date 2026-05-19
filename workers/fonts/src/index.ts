/// <reference types="@cloudflare/workers-types" />

interface Env {
  FONTS_BUCKET: R2Bucket;
  FONT_ACCESS_KEY?: string;
}

const ALLOWED_ORIGINS = new Set([
  "https://watilo.com",
  "https://www.watilo.com",
  "http://localhost:3000",
]);

const CONTENT_TYPES: Record<string, string> = {
  woff2: "font/woff2",
  woff: "font/woff",
};

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    return url.hostname.endsWith(".vercel.app") && url.protocol === "https:";
  } catch {
    return false;
  }
}

function extractOrigin(request: Request): string | null {
  const origin = request.headers.get("Origin");
  if (origin) return origin;

  const referer = request.headers.get("Referer");
  if (!referer) return null;
  try {
    const url = new URL(referer);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = extractOrigin(request);
    const token = url.searchParams.get("k");

    const keyMatches = !!env.FONT_ACCESS_KEY && token === env.FONT_ACCESS_KEY;
    const originAllowed = isAllowedOrigin(origin);
    const authorized = keyMatches || originAllowed;

    if (request.method === "OPTIONS") {
      if (!authorized) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    if (!authorized) {
      return new Response("Forbidden", { status: 403 });
    }

    const key = url.pathname.slice(1);
    if (!key) return new Response("Not Found", { status: 404 });

    const object = await env.FONTS_BUCKET.get(key);
    if (!object) return new Response("Not Found", { status: 404 });

    const ext = key.split(".").pop()?.toLowerCase() ?? "";
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "ETag": object.httpEtag,
      ...corsHeaders(origin),
    };

    if (request.method === "HEAD") {
      headers["Content-Length"] = String(object.size);
      return new Response(null, { headers });
    }

    return new Response(object.body, { headers });
  },
} satisfies ExportedHandler<Env>;

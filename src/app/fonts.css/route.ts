import { FONTS } from "@/lib/fonts";

export const dynamic = "force-dynamic";

export function GET() {
  const host = process.env.NEXT_PUBLIC_FONT_HOST;
  if (!host) {
    return new Response("/* NEXT_PUBLIC_FONT_HOST is not set */", {
      status: 500,
      headers: { "Content-Type": "text/css; charset=utf-8" },
    });
  }

  const key = process.env.FONT_ACCESS_KEY;
  const qs = key ? `?k=${encodeURIComponent(key)}` : "";

  const css = FONTS.map(({ family, weight, style, file }) => {
    const woff2 = `${host}/${file}.woff2${qs}`;
    const woff = `${host}/${file}.woff${qs}`;
    return `@font-face {
  font-family: "${family}";
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url("${woff2}") format("woff2"),
       url("${woff}") format("woff");
}`;
  }).join("\n\n");

  return new Response(css + "\n", {
    headers: {
      "Content-Type": "text/css; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

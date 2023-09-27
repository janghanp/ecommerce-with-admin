import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");
  const path = url.pathname;
  const query = url.searchParams.toString();

  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return;
  }

  if (hostname === `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return NextResponse.redirect(`https://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  }

  return NextResponse.rewrite(new URL(`/subdomain/${hostname}${path}?${query}`, req.url));
}

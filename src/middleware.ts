// import { NextRequest, NextResponse } from "next/server";
// import { authMiddleware } from "@clerk/nextjs";
import { withAuth } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {},
  {
    callbacks: {
      authorized: ({ token }) => true,
    },
  }
);

// export default authMiddleware({
//     afterAuth(auth, req: NextRequest, _evt) {
//         const url = req.nextUrl;
//
//         const hostname = req.headers.get("host");
//
//         const path = url.pathname;
//
//         const query = url.searchParams.toString();
//
//         if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
//             return;
//         }
//
//         if (hostname === `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
//             return NextResponse.redirect(`https://app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
//         }
//
//         return NextResponse.rewrite(new URL(`/subdomain/${hostname}${path}?${query}`, req.url));
//     },
//     publicRoutes: ["/subdomain/:domain*"],
// });

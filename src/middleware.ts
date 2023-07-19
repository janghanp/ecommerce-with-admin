import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();

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
//         return NextResponse.rewrite(new URL(`/subdomain/${hostname}${path}?${query}`, req.url));
//     },
//     publicRoutes: ["/subdomain/:domain*"],
// });

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

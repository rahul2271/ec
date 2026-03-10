import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Protected routes for authenticated users only
  const protectedRoutes = ["/account", "/cart", "/checkout", "/orders", "/wishlist"];
  
  // Affiliate-only routes
  const affiliateRoutes = ["/affiliate"];
  
  // Admin-only routes
  const adminRoutes = ["/admin"];

  const pathname = request.nextUrl.pathname;

  // Check if current path is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAffiliateRoute = affiliateRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Get session from cookie (set by Auth.js)
  const sessionToken = request.cookies.get("authjs.session-token")?.value || 
                       request.cookies.get("__Secure-authjs.session-token")?.value;

  // Redirect to login if accessing protected route without session
  if ((isProtected || isAffiliateRoute || isAdminRoute) && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/affiliate/:path*",
    "/admin/:path*",
  ],
};

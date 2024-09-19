import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow access to home page, specific API routes, and assets (like static files)
  if (
    pathname === "/" ||
    pathname.startsWith("/api/checkReferred") ||
    pathname.startsWith("/api/useReferralCode") ||
    pathname.startsWith("/api/setWalletAddress") ||
    pathname.startsWith("/api/removeWalletAddress") ||
    pathname.startsWith("/_next") || // Allow Next.js internal requests
    pathname.startsWith("/static") || // Allow static assets
    pathname.startsWith("/favicon.ico") || // Allow favicon requests
    pathname.startsWith("/fonts") || // Allow fonts
    pathname.startsWith("/images") // Allow images
  ) {
    return NextResponse.next();
  }

  // Check if the wallet_address cookie exists
  const walletAddress = req.cookies.get("wallet_address")?.value;

  console.log("walletAddress", walletAddress);

  if (!walletAddress) {
    // If no wallet is connected, redirect to home
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Check the referral status by calling an internal API
  const referralResponse = await fetch(
    `${req.nextUrl.origin}/api/checkReferred?wallet_address=${walletAddress}`
  );
  const referralData = await referralResponse.json();

  console.log(referralData);

  // If wallet is not referred, redirect to home
  if (!referralData.isReferred) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If everything is okay, proceed to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};

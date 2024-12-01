import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow access to home page, specific API routes, and assets (like static files)
  if (
    pathname === "/" ||
    pathname.includes("api") || // Allow all API routes
    pathname.includes("_next") || // Allow Next.js internal requests
    pathname.includes("favicon.ico") || // Allow favicon requests
    pathname.includes("background.jpg") || // Allow fonts
    pathname.includes("manifest.json") ||
    pathname.includes("android-launchericon-72-72.png") ||
    pathname.includes("144.png")
  ) {
    return NextResponse.next();
  }

  // Check if the wallet_address cookie exists
  const walletAddress = req.cookies.get("wallet_address")?.value;
  console.log("Wallet address from cookie:", walletAddress);

  if (!walletAddress) {
    console.log("No wallet address found in cookies, redirecting to home.");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Restrict access to certain paths
  const restrictedPaths = ["/nft"];
  if (restrictedPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Check the referral status by calling an internal API
  const referralResponse = await fetch(
    `${req.nextUrl.origin}/api/checkReferred?wallet_address=${walletAddress}`
  );
  const referralData = await referralResponse.json();

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

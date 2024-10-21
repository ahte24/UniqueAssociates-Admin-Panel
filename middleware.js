import { NextResponse } from "next/server";

export function middleware(request) {
	// Retrieve the "adminAccessToken" from the request cookies
	const isLoggedIn = request.cookies.get("adminAccessToken");

	// Define routes that require user authentication
	const protectedRoutes = ["/services", "/user", "/orders"];

	// Check if the request is for a protected route and if the user is not logged in
	if (
		protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path)) &&
		!isLoggedIn
	) {
		// Redirect to the homepage (or login page) if not logged in
		return NextResponse.redirect(new URL("/", request.url));
	}

	// If the user is logged in and tries to access the homepage ("/"), redirect them to "/services"
	if (request.nextUrl.pathname === "/" && isLoggedIn) {
		return NextResponse.redirect(new URL("/orders", request.url));
	}

	// Allow the request to continue if the user is logged in or if the route is not protected
	return NextResponse.next();
}

// Configure the middleware to apply to specific routes
export const config = {
	matcher: [
		"/",
		"/services/:path*",
		"/user",
		"/orders",
		"/services/add_service",
	], // Apply to login, services, and user routes
};

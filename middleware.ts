import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect all dashboard routes and admin pages
        const protectedPaths = [
          '/dashboard',
          '/add-event',
          '/manage-events'
        ];
        
        const isProtected = protectedPaths.some(path => 
          req.nextUrl.pathname.startsWith(path)
        );
        
        if (isProtected) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/add-event/:path*", 
    "/manage-events/:path*"
  ]
};
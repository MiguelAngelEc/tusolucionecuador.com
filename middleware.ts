import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define rutas públicas (que no requieren autenticación)
const isPublicRoute = createRouteMatcher([
  '/',           // Página principal
  '/sign-in(.*)', // Rutas de sign-in (si las usas)
  '/sign-up(.*)', // Rutas de sign-up (si las usas)
]);

export default clerkMiddleware(async (auth, request) => {
  // Si no es una ruta pública, protege la ruta
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
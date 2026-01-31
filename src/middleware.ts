import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { createServerClient } from "@supabase/ssr";

/**
 * ════════════════════════════════════════════════════════════
 * MIDDLEWARE - ÍKHOR
 * ════════════════════════════════════════════════════════════
 * 
 * Intercepta TODAS las rutas antes de renderizar
 * 
 * SEGURIDAD:
 * - Protege /admin (solo admin autorizado)
 * - Si NO es admin: Redirige a home ANTES de cargar
 * - CERO segundos de exposición
 * 
 * VENTAJA:
 * - La página /admin NI SIQUIERA se renderiza si no eres admin
 * - Imposible hacer screenshot de datos sensibles
 * ════════════════════════════════════════════════════════════
 */

export async function middleware(request: NextRequest) {
  // Actualizar sesión de Supabase
  let response = await updateSession(request);
  
  // ═══════════════════════════════════════════════════════
  // PROTECCIÓN DE RUTA /admin
  // ═══════════════════════════════════════════════════════
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    
    // Si NO está autenticado → Login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Si NO es el admin autorizado → Home (silencioso)
    const ADMIN_EMAIL = "anthonybarreiro369@gmail.com";
    if (user.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Si llegó aquí = ES ADMIN → Permitir acceso
  }
  
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

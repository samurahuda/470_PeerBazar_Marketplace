import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { UserRoleService } from '$lib/services/user-role.service';

// Check if user is authenticated (server-side)
export async function requireAuth(event: RequestEvent) {
  const { data: { user } } = await event.locals.supabase.auth.getUser();
  
  if (!user) {
    throw redirect(303, '/auth/login');
  }
  
  return { user };
}

// Get current user (server-side)
export async function getCurrentUser(event: RequestEvent) {
  const { data: { session } } = await event.locals.supabase.auth.getSession();
  return session?.user ?? null;
}

// Validate email format (must be @g.bracu.ac.bd)
export function isValidEmail(email: string): boolean {
  return email.endsWith('@g.bracu.ac.bd');
}

// Validate password strength
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// Check if user is already logged in
export async function redirectIfLoggedIn(event: RequestEvent, redirectTo: string = '/myspace') {
  const { data: { session } } = await event.locals.supabase.auth.getSession();
  
  if (session) {
    throw redirect(303, redirectTo);
  }
}

// Check if user is admin and redirect accordingly
export async function requireAdmin(event: RequestEvent) {
  const session = await requireAuth(event);
  const userRoleService = new UserRoleService(event.locals.supabase);
  
  const isAdmin = await userRoleService.isAdmin(session.user.id);
  
  if (!isAdmin) {
    throw redirect(303, '/myspace');
  }
  
  return session;
}

// Get user role and redirect to appropriate dashboard
export async function redirectBasedOnRole(event: RequestEvent) {
  const session = await requireAuth(event);
  const userRoleService = new UserRoleService(event.locals.supabase);
  
  const role = await userRoleService.getUserRole(session.user.id);
  
  if (role === 'admin') {
    throw redirect(303, '/admin');
  } else {
    throw redirect(303, '/myspace');
  }
}
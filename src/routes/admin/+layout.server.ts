import { requireAdmin } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  // Ensure only admins can access admin routes
  const session = await requireAdmin(event);
  
  return { session };
};

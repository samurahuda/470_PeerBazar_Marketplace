import type { LayoutServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth';
import { UserRoleService } from '$lib/services/user-role.service';

export const load: LayoutServerLoad = async (event) => {
  const session = await requireAuth(event);
  
  // Get user role server-side
  const userRoleService = new UserRoleService(event.locals.supabase);
  const userRole = await userRoleService.getUserRole(session.user.id);
  const isAdmin = userRole === 'admin';

  event.setHeaders({
    'cache-control': 'no-store, max-age=0, must-revalidate',
    'pragma': 'no-cache'
  });

  return { 
    session,
    userRole,
    isAdmin
  };
};



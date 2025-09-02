import { fail, redirect } from '@sveltejs/kit';
import { isValidEmail, isValidPassword, redirectIfLoggedIn } from '$lib/server/auth';
import { UserRoleService } from '$lib/services/user-role.service';
import type { Actions, RequestEvent } from '@sveltejs/kit';

// Check if already logged in - redirect if so
export const load = async (event: RequestEvent) => {
  await redirectIfLoggedIn(event);
  return {};
};

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!email || !password) {
      return fail(400, { 
        error: 'Email and password are required',
        email 
      });
    }

    if (!isValidEmail(email)) {
      return fail(400, { 
        error: 'Please use your BRACU email (@g.bracu.ac.bd)',
        email 
      });
    }

    if (!isValidPassword(password)) {
      return fail(400, { 
        error: 'Password must be at least 6 characters long',
        email 
      });
    }

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return fail(400, { 
        error: error.message,
        email 
      });
    }

    // Check user role and redirect accordingly
    if (data.user) {
      const userRoleService = new UserRoleService(supabase);
      const role = await userRoleService.getUserRole(data.user.id);
      
      if (role === 'admin') {
        throw redirect(303, '/admin');
      } else {
        throw redirect(303, '/myspace');
      }
    }

    // Fallback to myspace if role check fails
    throw redirect(303, '/myspace');
  }
};
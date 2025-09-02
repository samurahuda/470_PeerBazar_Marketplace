import { fail, redirect } from '@sveltejs/kit';
import { isValidEmail, isValidPassword, redirectIfLoggedIn } from '$lib/server/auth';
import type { Actions, RequestEvent } from '@sveltejs/kit';

// Check if already logged in - redirect if so
export const load = async (event: RequestEvent) => {
  await redirectIfLoggedIn(event);
  return {};
};

export const actions: Actions = {
  register: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation
    if (!email || !password || !confirmPassword) {
      return fail(400, { 
        error: 'All fields are required',
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

    if (password !== confirmPassword) {
      return fail(400, { 
        error: 'Passwords do not match',
        email 
      });
    }

    // Attempt registration
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/auth/callback`
      }
    });

    if (error) {
      return fail(400, { 
        error: error.message,
        email 
      });
    }

    // Success - redirect to login page
    throw redirect(303, '/auth/login');
  }
};
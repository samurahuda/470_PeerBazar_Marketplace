import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
  await supbaseSignOut(supabase);
  throw redirect(303, '/auth/login');
};

async function supbaseSignOut(supabaseClient: { auth: { signOut: () => Promise<unknown> } }) {
  try {
    await supabaseClient.auth.signOut();
  } catch {
    // ignore errors to ensure redirect
  }
}



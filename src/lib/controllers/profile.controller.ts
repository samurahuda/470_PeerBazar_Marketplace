import type { RequestEvent, Actions } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/auth';
import { ensureProfile, updateProfile } from '$lib/services/profile.service';

export const loadProfile = async (event: RequestEvent) => {
  const session = await requireAuth(event);
  const user = session.user;

  const displayNameFromMeta =
    (user.user_metadata && (user.user_metadata.full_name as string)) ??
    user.email?.split('@')[0] ??
    null;

  const profile = await ensureProfile(event.locals.supabase, {
    userId: user.id,
    email: user.email ?? null,
    displayName: displayNameFromMeta
  });

  return {
    profile,
    email: user.email,
    display_name: profile.display_name ?? displayNameFromMeta
  };
};

export const actions: Actions = {
  updateProfile: async (event) => {
    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    if (!session) return { error: 'Not authenticated' };

    const formData = await event.request.formData();
    const updates = {
      nickname: (formData.get('nickname') as string | null) ?? null,
      alternative_email: (formData.get('alternative_email') as string | null) ?? null,
      mobile_phone: (formData.get('mobile_phone') as string | null) ?? null,
      student_id: (formData.get('student_id') as string | null) ?? null,
      department: (formData.get('department') as string | null) ?? null,
      semester: (formData.get('semester') as string | null) ?? null
    };

    try {
      await updateProfile(event.locals.supabase, session.user.id, updates);
      return { success: true, message: 'Profile saved successfully.' };
    } catch (e: any) {
      return { error: e?.message ?? 'Failed to update profile', values: updates };
    }
  },

  changePassword: async (event) => {
    const formData = await event.request.formData();
    const current = (formData.get('current_password') as string) ?? '';
    const next = (formData.get('new_password') as string) ?? '';

    if (!current || !next) return { error: 'Both fields are required' };
    if (next.length < 6) return { error: 'Password must be at least 6 characters' };

    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();
    if (!session) return { error: 'Not authenticated' };

    const email = session.user.email!;
    const { error: signInErr } = await event.locals.supabase.auth.signInWithPassword({
      email,
      password: current
    });
    if (signInErr) return { error: 'Current password is incorrect' };

    const { error: updateErr } = await event.locals.supabase.auth.updateUser({ password: next });
    if (updateErr) return { error: updateErr.message };

    await event.locals.supabase.auth.signOut();
    throw redirect(303, '/auth/login');
  }
};



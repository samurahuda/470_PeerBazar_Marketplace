import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile, ProfileUpdateInput } from '$lib/types/profile';

const profileSelect = `
  id,email,display_name,nickname,mobile_phone,alternative_email,
  student_id,department,semester,profile_completed,created_at,updated_at
`;

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(profileSelect)
    .eq('id', userId)
    .maybeSingle();

  if (error && (error as any).code !== 'PGRST116') {
    throw new Error(error.message);
  }
  return (data as Profile) ?? null;
}

export async function initProfileIfMissing(
  supabase: SupabaseClient,
  userId: string,
  email: string | null,
  displayName: string | null
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, email, display_name: displayName }, { onConflict: 'id' })
    .select(profileSelect)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as Profile;
}

export async function updateProfileByUserId(
  supabase: SupabaseClient,
  userId: string,
  updates: ProfileUpdateInput & { profile_completed?: boolean }
): Promise<void> {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  if (error) {
    throw new Error(error.message);
  }
}



import type { SupabaseClient } from '@supabase/supabase-js';
import type { Profile, ProfileUpdateInput } from '$lib/types/profile';
import { getProfileByUserId, initProfileIfMissing, updateProfileByUserId } from '$lib/repositories/profile.repository';

function isValidAlternativeEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone: string) {
  return /^(\+?8801\d{9}|01\d{9}|\+\d{10,15})$/.test(phone);
}
function isValidStudentId(id: string) {
  return /^[0-9]{8}$/.test(id);
}

export async function ensureProfile(
  supabase: SupabaseClient,
  params: { userId: string; email: string | null; displayName: string | null }
): Promise<Profile> {
  const existing = await getProfileByUserId(supabase, params.userId);
  if (existing) return existing;
  return await initProfileIfMissing(supabase, params.userId, params.email, params.displayName);
}

export type UpdateValidationResult =
  | { ok: true; updates: ProfileUpdateInput & { profile_completed: boolean } }
  | { ok: false; error: string };

export function validateAndPrepareUpdates(payload: ProfileUpdateInput): UpdateValidationResult {
  const trimmed: ProfileUpdateInput = {
    nickname: payload.nickname?.trim() || null,
    alternative_email: payload.alternative_email?.trim() || null,
    mobile_phone: payload.mobile_phone?.trim() || null,
    student_id: payload.student_id?.trim() || null,
    department: payload.department?.trim() || null,
    semester: payload.semester?.trim() || null
  };

  if (trimmed.alternative_email && !isValidAlternativeEmail(trimmed.alternative_email)) {
    return { ok: false, error: 'Invalid alternative email' };
  }
  if (trimmed.mobile_phone && !isValidPhone(trimmed.mobile_phone)) {
    return { ok: false, error: 'Invalid phone number' };
  }
  if (trimmed.student_id && !isValidStudentId(trimmed.student_id)) {
    return { ok: false, error: 'Student ID must be 8 digits' };
  }

  const profile_completed = Boolean(
    trimmed.mobile_phone && trimmed.student_id && trimmed.department && trimmed.semester
  );

  return { ok: true, updates: { ...trimmed, profile_completed } };
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: ProfileUpdateInput
): Promise<void> {
  const validation = validateAndPrepareUpdates(updates);
  if (!validation.ok) throw new Error(validation.error);
  await updateProfileByUserId(supabase, userId, validation.updates);
}



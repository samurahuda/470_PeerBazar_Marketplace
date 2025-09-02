import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from '$lib/supabase';
import type { User } from '@supabase/supabase-js';

// Auth state stores
export const user = writable<User | null>(null);
export const loading = writable(true);
export const isAuthenticated = writable(false);

// Only run in browser (client-side)
if (browser) {
  // Initialize auth state
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.set(session?.user ?? null);
    loading.set(false);
  });

  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    user.set(session?.user ?? null);
    loading.set(false);
  });
}

// Helper: automatically update isAuthenticated when user changes
user.subscribe(($user) => {
  isAuthenticated.set(!!$user);
});
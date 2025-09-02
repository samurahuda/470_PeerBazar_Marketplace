import type { SupabaseClient } from '@supabase/supabase-js';

export type UserRole = 'student' | 'admin';

export interface UserRoleData {
  id: string;
  role: UserRole;
  created_at: string;
}

export class UserRoleService {
  constructor(private supabase: SupabaseClient) {}

  async getUserRole(userId: string): Promise<UserRole> {
    try {
      console.log('getUserRole called for userId:', userId);
      
      // Try direct query first
      const { data, error } = await this.supabase
        .from('user_roles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      console.log('Direct query result:', { data, error });

      if (error) {
        console.log('Direct query failed, trying RPC function');
        // If RLS is blocking, use the database function
        const { data: altData, error: altError } = await this.supabase
          .rpc('get_user_role', { user_id: userId });
        
        console.log('RPC query result:', { altData, altError });
        
        if (altError) {
          console.error('Error fetching user role:', altError);
          return 'student'; // Default to student if error
        }
        
        const role = (altData as UserRole) || 'student';
        console.log('Returning role from RPC:', role);
        return role;
      }

      const role = (data?.role as UserRole) || 'student';
      console.log('Returning role from direct query:', role);
      return role;
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return 'student'; // Default to student if error
    }
  }

  async isAdmin(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'admin';
  }

  async isStudent(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'student';
  }

  async updateUserRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      // Try direct update first (for server-side calls)
      const { error } = await this.supabase
        .from('user_roles')
        .upsert({ id: userId, role })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      return false;
    }
  }

  // Method to update user role via server endpoint (for client-side calls)
  async updateUserRoleViaServer(userId: string, role: UserRole): Promise<boolean> {
    try {
      const response = await fetch('/myspace/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Error updating user role via server:', error);
      return false;
    }
  }
}

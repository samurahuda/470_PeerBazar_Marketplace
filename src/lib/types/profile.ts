export type Profile = {
  id: string;
  email: string;
  display_name: string | null;
  nickname: string | null;
  mobile_phone: string | null;
  alternative_email: string | null;
  student_id: string | null;
  department: string | null;
  semester: string | null;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileUpdateInput = {
  nickname?: string | null;
  alternative_email?: string | null;
  mobile_phone?: string | null;
  student_id?: string | null;
  department?: string | null;
  semester?: string | null;
};



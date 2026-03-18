import { createClient } from '@supabase/supabase-js';
import type { User, Department, DepartmentRole } from '@/types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helpers
export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Fetch additional user data from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return {
    id: user.id,
    email: user.email!,
    role: (profile?.role as DepartmentRole) || 'viewer',
    department: (profile?.department as Department) || 'tnd',
    name: profile?.name || user.email!.split('@')[0],
    avatar_url: profile?.avatar_url,
    created_at: user.created_at,
  };
};

// Role-based access control
export const hasDepartmentAccess = (user: User | null, department: Department): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.department === department;
};

export const hasRoleAccess = (user: User | null, requiredRoles: DepartmentRole[]): boolean => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return requiredRoles.includes(user.role);
};

// Database helpers for T&D
export const tndDb = {
  // Get all monthly reports
  getReports: async (filters?: { month?: string; year?: number; status?: string }) => {
    let query = supabase.from('tnd_monthly_reports').select('*');
    
    if (filters?.month) query = query.eq('month', filters.month);
    if (filters?.year) query = query.eq('year', filters.year);
    if (filters?.status) query = query.eq('status', filters.status);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },
  
  // Get single report
  getReport: async (id: string) => {
    const { data, error } = await supabase
      .from('tnd_monthly_reports')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  },
  
  // Create report
  createReport: async (report: any) => {
    const { data, error } = await supabase
      .from('tnd_monthly_reports')
      .insert(report)
      .select()
      .single();
    return { data, error };
  },
  
  // Update report
  updateReport: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('tnd_monthly_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },
  
  // Delete report
  deleteReport: async (id: string) => {
    const { error } = await supabase
      .from('tnd_monthly_reports')
      .delete()
      .eq('id', id);
    return { error };
  },
  
  // Get dashboard KPIs
  getKPIs: async (month: string, year: number) => {
    const { data, error } = await supabase
      .from('tnd_monthly_reports')
      .select('*')
      .eq('month', month)
      .eq('year', year)
      .eq('status', 'approved')
      .single();
    
    if (error || !data) return { data: null, error };
    
    // Calculate KPIs from report data
    const kpis = {
      totalTeachers: data.onboarding?.new_teachers_onboarded || 0,
      activeTeachers: data.trial_classes?.teachers_to_live || 0,
      trialPassRate: data.trial_classes?.trial_pass_rate || 0,
      complianceRate: data.compliance ? 
        ((data.compliance.teachers_audited - data.compliance.violations_identified) / 
         (data.compliance.teachers_audited || 1) * 100) : 0,
      trainingHours: data.ongoing_training?.training_hours || 0,
      complaintsResolved: data.parent_feedback?.complaints_resolved || 0,
      qualityScore: data.quality_assurance ? 
        ((data.quality_assurance.teachers_rated_a * 3 + 
          data.quality_assurance.teachers_rated_b * 2 + 
          data.quality_assurance.teachers_rated_c * 1) /
         ((data.quality_assurance.teachers_rated_a + 
           data.quality_assurance.teachers_rated_b + 
           data.quality_assurance.teachers_rated_c) || 1) * 33.33) : 0,
      attendanceCompliance: data.attendance_management ? 
        ((data.attendance_management.leaves_reviewed - 
          data.attendance_management.teachers_flagged_attendance) / 
         (data.attendance_management.leaves_reviewed || 1) * 100) : 0,
    };
    
    return { data: kpis, error: null };
  },
};

// Google Sheets sync helper (placeholder - requires Google API setup)
export const syncWithGoogleSheets = async (sheetId: string, data: any) => {
  // This would integrate with Google Sheets API
  // For now, return a placeholder
  console.log('Syncing with Google Sheets:', sheetId, data);
  return { success: true, message: 'Sync functionality requires Google API setup' };
};

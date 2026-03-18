// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: DepartmentRole;
  department: Department;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export type DepartmentRole = 'admin' | 'manager' | 'staff' | 'viewer';

export type Department = 
  | 'tnd' 
  | 'support' 
  | 'sales' 
  | 'finance' 
  | 'marketing' 
  | 'hr' 
  | 'recruitment' 
  | 'admin' 
  | 'shift_incharge';

// T&D Department Data Types
export interface TNDMonthlyReport {
  id: string;
  month: string;
  year: number;
  submitted_by: string;
  submitted_at: string;
  status: 'draft' | 'submitted' | 'approved';
  
  // Onboarding & Initial Training
  onboarding: {
    new_teachers_onboarded: number;
    orientation_sessions: number;
    training_batches_completed: number;
    trainees_passed: number;
    trainees_failed: number;
  };
  
  // Trial Classes Oversight
  trial_classes: {
    trials_assigned: number;
    trials_evaluated: number;
    trial_pass_rate: number;
    trial_fail_rate: number;
    teachers_to_live: number;
    teachers_retrained: number;
  };
  
  // Ongoing Teacher Training
  ongoing_training: {
    sessions_conducted: number;
    teachers_trained: number;
    training_hours: number;
    teachers_marked_improvement: number;
    teachers_cleared: number;
  };
  
  // Policy Compliance
  compliance: {
    teachers_audited: number;
    violations_identified: number;
    warnings_issued: number;
    confirmations_signed: number;
    zero_verbal_commitments: boolean;
  };
  
  // Parent Feedback & Resolution
  parent_feedback: {
    complaints_received: number;
    quality_complaints: number;
    complaints_resolved: number;
    complaints_escalated: number;
    repeat_complaints: number;
  };
  
  // Teacher Counselling & Performance Management
  counselling: {
    teachers_counselled: number;
    pips_initiated: number;
    teachers_improved: number;
    teachers_recommended_termination: number;
  };
  
  // Leave, Half-Day & Late Management
  attendance_management: {
    leaves_reviewed: number;
    late_arrivals_reviewed: number;
    academic_impact_incidents: number;
    teachers_flagged_attendance: number;
  };
  
  // Class Monitoring & Quality Assurance
  quality_assurance: {
    classes_monitored: number;
    quality_audits: number;
    teachers_rated_a: number;
    teachers_rated_b: number;
    teachers_rated_c: number;
    teachers_downgraded: number;
    teachers_upgraded: number;
    qa_red_flag_teachers: number;
  };
  
  // Scheduling & PTM
  scheduling: {
    scheduling_issues: number;
    ptms_conducted: number;
    ptms_escalated: number;
    action_items_closed: number;
  };
  
  // Substitute Teacher Management
  substitutes: {
    substitutes_assigned: number;
    emergency_substitutions: number;
    substitution_quality_issues: number;
    substitute_escalations: number;
  };
  
  // Overtime Validation
  overtime: {
    overtime_hours_reviewed: number;
    overtime_approved: number;
    overtime_rejected: number;
    teachers_flagged_overtime: number;
  };
  
  // Record Keeping & Documentation
  records: {
    teacher_records_updated: number;
    training_records_maintained: number;
    compliance_records_complete: boolean;
    missing_documentation: number;
  };
  
  // Reporting & Approvals
  reporting: {
    report_submitted_on_time: boolean;
    pending_approvals: number;
    delayed_actions: number;
  };
  
  // Content & R&D
  content_rd: {
    curriculum_updates_proposed: number;
    curriculum_updates_approved: number;
    new_content_created: number;
    website_content_reviewed: number;
    books_material_updated: number;
  };
}

// Dashboard KPI Types
export interface TNDKPIs {
  totalTeachers: number;
  activeTeachers: number;
  trialPassRate: number;
  complianceRate: number;
  trainingHours: number;
  complaintsResolved: number;
  qualityScore: number;
  attendanceCompliance: number;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

export interface TrendData {
  month: string;
  value: number;
  target?: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'date' | 'checkbox' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  min?: number;
  max?: number;
}

// Table Types
export interface Column {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

// Department Configuration
export interface DepartmentConfig {
  id: Department;
  name: string;
  description: string;
  icon: string;
  color: string;
  kpis: string[];
  reportFrequency: 'daily' | 'weekly' | 'monthly';
}

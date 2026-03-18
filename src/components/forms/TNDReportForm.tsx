import { useState } from 'react';
import { Save, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TNDReportFormProps {
  initialData?: any;
  onSubmit: (data: any, status: 'draft' | 'submitted') => void;
  onCancel: () => void;
  className?: string;
}

const NumberInput = ({ 
  label, 
  value, 
  onChange, 
  min = 0,
  max,
  suffix = ''
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <div className="relative">
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-9 pr-8"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const SectionCard = ({ 
  title, 
  children, 
  className 
}: { 
  title: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn('', className)}>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-semibold text-[#0d4f42]">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </CardContent>
  </Card>
);

export function TNDReportForm({ initialData, onSubmit, onCancel, className }: TNDReportFormProps) {
  const [activeTab, setActiveTab] = useState('onboarding');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear(),
    new_teachers_onboarded: 0,
    orientation_sessions: 0,
    training_batches_completed: 0,
    trainees_passed: 0,
    trainees_failed: 0,
    trials_assigned: 0,
    trials_evaluated: 0,
    trial_pass_rate: 0,
    trial_fail_rate: 0,
    teachers_to_live: 0,
    teachers_retrained: 0,
    sessions_conducted: 0,
    teachers_trained: 0,
    training_hours: 0,
    teachers_marked_improvement: 0,
    teachers_cleared: 0,
    teachers_audited: 0,
    violations_identified: 0,
    warnings_issued: 0,
    confirmations_signed: 0,
    zero_verbal_commitments: true,
    complaints_received: 0,
    quality_complaints: 0,
    complaints_resolved: 0,
    complaints_escalated: 0,
    repeat_complaints: 0,
    teachers_counselled: 0,
    pips_initiated: 0,
    teachers_improved: 0,
    teachers_recommended_termination: 0,
    leaves_reviewed: 0,
    late_arrivals_reviewed: 0,
    academic_impact_incidents: 0,
    teachers_flagged_attendance: 0,
    classes_monitored: 0,
    quality_audits: 0,
    teachers_rated_a: 0,
    teachers_rated_b: 0,
    teachers_rated_c: 0,
    teachers_downgraded: 0,
    teachers_upgraded: 0,
    qa_red_flag_teachers: 0,
    scheduling_issues: 0,
    ptms_conducted: 0,
    ptms_escalated: 0,
    action_items_closed: 0,
    substitutes_assigned: 0,
    emergency_substitutions: 0,
    substitution_quality_issues: 0,
    substitute_escalations: 0,
    overtime_hours_reviewed: 0,
    overtime_approved: 0,
    overtime_rejected: 0,
    teachers_flagged_overtime: 0,
    teacher_records_updated: 0,
    training_records_maintained: 0,
    compliance_records_complete: true,
    missing_documentation: 0,
    report_submitted_on_time: true,
    pending_approvals: 0,
    delayed_actions: 0,
    curriculum_updates_proposed: 0,
    curriculum_updates_approved: 0,
    new_content_created: 0,
    website_content_reviewed: 0,
    books_material_updated: 0,
    ...initialData,
  };

  const [formData, setFormData] = useState(defaultValues);

  const handleSave = async (status: 'draft' | 'submitted') => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData, status);
      toast.success(status === 'submitted' ? 'Report submitted successfully!' : 'Draft saved successfully!');
    } catch (error) {
      toast.error('Failed to save report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#0d4f42]">Monthly T&D Report</h2>
          <p className="text-sm text-muted-foreground">
            {formData.month} {formData.year} - Training & Development Department
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSave('draft')}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            className="bg-[#0d4f42] hover:bg-[#0d4f42]/90"
            onClick={() => handleSave('submitted')}
            disabled={isSubmitting}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Report
          </Button>
        </div>
      </div>

      <Separator />

      {/* Form Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 lg:grid-cols-14 bg-muted/50 p-1 flex-wrap h-auto">
          <TabsTrigger value="onboarding" className="text-xs">Onboarding</TabsTrigger>
          <TabsTrigger value="trials" className="text-xs">Trials</TabsTrigger>
          <TabsTrigger value="training" className="text-xs">Training</TabsTrigger>
          <TabsTrigger value="compliance" className="text-xs">Compliance</TabsTrigger>
          <TabsTrigger value="feedback" className="text-xs">Feedback</TabsTrigger>
          <TabsTrigger value="counselling" className="text-xs">Counselling</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs">Attendance</TabsTrigger>
          <TabsTrigger value="quality" className="text-xs">Quality</TabsTrigger>
          <TabsTrigger value="scheduling" className="text-xs">Scheduling</TabsTrigger>
          <TabsTrigger value="substitutes" className="text-xs">Substitutes</TabsTrigger>
          <TabsTrigger value="overtime" className="text-xs">Overtime</TabsTrigger>
          <TabsTrigger value="records" className="text-xs">Records</TabsTrigger>
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
        </TabsList>

        {/* Onboarding Tab */}
        <TabsContent value="onboarding" className="mt-4">
          <SectionCard title="Onboarding & Initial Training">
            <NumberInput
              label="New Teachers Onboarded"
              value={formData.new_teachers_onboarded}
              onChange={(v) => updateField('new_teachers_onboarded', v)}
            />
            <NumberInput
              label="Orientation Sessions"
              value={formData.orientation_sessions}
              onChange={(v) => updateField('orientation_sessions', v)}
            />
            <NumberInput
              label="Training Batches Completed"
              value={formData.training_batches_completed}
              onChange={(v) => updateField('training_batches_completed', v)}
            />
            <NumberInput
              label="Trainees Passed"
              value={formData.trainees_passed}
              onChange={(v) => updateField('trainees_passed', v)}
            />
            <NumberInput
              label="Trainees Failed/Dropped"
              value={formData.trainees_failed}
              onChange={(v) => updateField('trainees_failed', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Trials Tab */}
        <TabsContent value="trials" className="mt-4">
          <SectionCard title="Trial Classes Oversight">
            <NumberInput
              label="Trials Assigned"
              value={formData.trials_assigned}
              onChange={(v) => updateField('trials_assigned', v)}
            />
            <NumberInput
              label="Trials Evaluated"
              value={formData.trials_evaluated}
              onChange={(v) => updateField('trials_evaluated', v)}
            />
            <NumberInput
              label="Trial Pass Rate"
              value={formData.trial_pass_rate}
              onChange={(v) => updateField('trial_pass_rate', v)}
              suffix="%"
              max={100}
            />
            <NumberInput
              label="Trial Fail Rate"
              value={formData.trial_fail_rate}
              onChange={(v) => updateField('trial_fail_rate', v)}
              suffix="%"
              max={100}
            />
            <NumberInput
              label="Teachers to Live Classes"
              value={formData.teachers_to_live}
              onChange={(v) => updateField('teachers_to_live', v)}
            />
            <NumberInput
              label="Teachers Sent for Retraining"
              value={formData.teachers_retrained}
              onChange={(v) => updateField('teachers_retrained', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Training Tab */}
        <TabsContent value="training" className="mt-4">
          <SectionCard title="Ongoing Teacher Training">
            <NumberInput
              label="Sessions Conducted"
              value={formData.sessions_conducted}
              onChange={(v) => updateField('sessions_conducted', v)}
            />
            <NumberInput
              label="Teachers Trained"
              value={formData.teachers_trained}
              onChange={(v) => updateField('teachers_trained', v)}
            />
            <NumberInput
              label="Training Hours Delivered"
              value={formData.training_hours}
              onChange={(v) => updateField('training_hours', v)}
            />
            <NumberInput
              label="Teachers Marked for Improvement"
              value={formData.teachers_marked_improvement}
              onChange={(v) => updateField('teachers_marked_improvement', v)}
            />
            <NumberInput
              label="Teachers Cleared After Retraining"
              value={formData.teachers_cleared}
              onChange={(v) => updateField('teachers_cleared', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="mt-4">
          <SectionCard title="Policy Compliance">
            <NumberInput
              label="Teachers Audited"
              value={formData.teachers_audited}
              onChange={(v) => updateField('teachers_audited', v)}
            />
            <NumberInput
              label="Violations Identified"
              value={formData.violations_identified}
              onChange={(v) => updateField('violations_identified', v)}
            />
            <NumberInput
              label="Written Warnings Issued"
              value={formData.warnings_issued}
              onChange={(v) => updateField('warnings_issued', v)}
            />
            <NumberInput
              label="Compliance Confirmations Signed"
              value={formData.confirmations_signed}
              onChange={(v) => updateField('confirmations_signed', v)}
            />
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Zero Verbal Commitments</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.zero_verbal_commitments}
                  onChange={(e) => updateField('zero_verbal_commitments', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{formData.zero_verbal_commitments ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </SectionCard>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="mt-4">
          <SectionCard title="Parent Feedback & Resolution">
            <NumberInput
              label="Complaints Received"
              value={formData.complaints_received}
              onChange={(v) => updateField('complaints_received', v)}
            />
            <NumberInput
              label="Quality Related Complaints"
              value={formData.quality_complaints}
              onChange={(v) => updateField('quality_complaints', v)}
            />
            <NumberInput
              label="Complaints Resolved"
              value={formData.complaints_resolved}
              onChange={(v) => updateField('complaints_resolved', v)}
            />
            <NumberInput
              label="Complaints Escalated"
              value={formData.complaints_escalated}
              onChange={(v) => updateField('complaints_escalated', v)}
            />
            <NumberInput
              label="Repeat Complaints"
              value={formData.repeat_complaints}
              onChange={(v) => updateField('repeat_complaints', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Counselling Tab */}
        <TabsContent value="counselling" className="mt-4">
          <SectionCard title="Teacher Counselling & Performance Management">
            <NumberInput
              label="Teachers Counselled"
              value={formData.teachers_counselled}
              onChange={(v) => updateField('teachers_counselled', v)}
            />
            <NumberInput
              label="PIPs Initiated"
              value={formData.pips_initiated}
              onChange={(v) => updateField('pips_initiated', v)}
            />
            <NumberInput
              label="Teachers Improved"
              value={formData.teachers_improved}
              onChange={(v) => updateField('teachers_improved', v)}
            />
            <NumberInput
              label="Recommended for Termination"
              value={formData.teachers_recommended_termination}
              onChange={(v) => updateField('teachers_recommended_termination', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="mt-4">
          <SectionCard title="Leave, Half-Day & Late Management">
            <NumberInput
              label="Leaves Reviewed"
              value={formData.leaves_reviewed}
              onChange={(v) => updateField('leaves_reviewed', v)}
            />
            <NumberInput
              label="Late Arrivals Reviewed"
              value={formData.late_arrivals_reviewed}
              onChange={(v) => updateField('late_arrivals_reviewed', v)}
            />
            <NumberInput
              label="Academic Impact Incidents"
              value={formData.academic_impact_incidents}
              onChange={(v) => updateField('academic_impact_incidents', v)}
            />
            <NumberInput
              label="Teachers Flagged for Attendance"
              value={formData.teachers_flagged_attendance}
              onChange={(v) => updateField('teachers_flagged_attendance', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="mt-4">
          <SectionCard title="Class Monitoring & Quality Assurance">
            <NumberInput
              label="Classes Monitored"
              value={formData.classes_monitored}
              onChange={(v) => updateField('classes_monitored', v)}
            />
            <NumberInput
              label="Quality Audits Conducted"
              value={formData.quality_audits}
              onChange={(v) => updateField('quality_audits', v)}
            />
            <NumberInput
              label="Teachers Rated A"
              value={formData.teachers_rated_a}
              onChange={(v) => updateField('teachers_rated_a', v)}
            />
            <NumberInput
              label="Teachers Rated B"
              value={formData.teachers_rated_b}
              onChange={(v) => updateField('teachers_rated_b', v)}
            />
            <NumberInput
              label="Teachers Rated C"
              value={formData.teachers_rated_c}
              onChange={(v) => updateField('teachers_rated_c', v)}
            />
            <NumberInput
              label="Teachers Downgraded"
              value={formData.teachers_downgraded}
              onChange={(v) => updateField('teachers_downgraded', v)}
            />
            <NumberInput
              label="Teachers Upgraded"
              value={formData.teachers_upgraded}
              onChange={(v) => updateField('teachers_upgraded', v)}
            />
            <NumberInput
              label="QA Red Flag Teachers"
              value={formData.qa_red_flag_teachers}
              onChange={(v) => updateField('qa_red_flag_teachers', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="scheduling" className="mt-4">
          <SectionCard title="Scheduling & PTM">
            <NumberInput
              label="Scheduling Issues Reviewed"
              value={formData.scheduling_issues}
              onChange={(v) => updateField('scheduling_issues', v)}
            />
            <NumberInput
              label="PTMs Conducted"
              value={formData.ptms_conducted}
              onChange={(v) => updateField('ptms_conducted', v)}
            />
            <NumberInput
              label="PTMs Escalated"
              value={formData.ptms_escalated}
              onChange={(v) => updateField('ptms_escalated', v)}
            />
            <NumberInput
              label="Action Items Closed"
              value={formData.action_items_closed}
              onChange={(v) => updateField('action_items_closed', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Substitutes Tab */}
        <TabsContent value="substitutes" className="mt-4">
          <SectionCard title="Substitute Teacher Management">
            <NumberInput
              label="Substitutes Assigned"
              value={formData.substitutes_assigned}
              onChange={(v) => updateField('substitutes_assigned', v)}
            />
            <NumberInput
              label="Emergency Substitutions"
              value={formData.emergency_substitutions}
              onChange={(v) => updateField('emergency_substitutions', v)}
            />
            <NumberInput
              label="Substitution Quality Issues"
              value={formData.substitution_quality_issues}
              onChange={(v) => updateField('substitution_quality_issues', v)}
            />
            <NumberInput
              label="Substitute Escalations"
              value={formData.substitute_escalations}
              onChange={(v) => updateField('substitute_escalations', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Overtime Tab */}
        <TabsContent value="overtime" className="mt-4">
          <SectionCard title="Overtime Validation">
            <NumberInput
              label="Overtime Hours Reviewed"
              value={formData.overtime_hours_reviewed}
              onChange={(v) => updateField('overtime_hours_reviewed', v)}
            />
            <NumberInput
              label="Overtime Approved"
              value={formData.overtime_approved}
              onChange={(v) => updateField('overtime_approved', v)}
            />
            <NumberInput
              label="Overtime Rejected"
              value={formData.overtime_rejected}
              onChange={(v) => updateField('overtime_rejected', v)}
            />
            <NumberInput
              label="Teachers Flagged for Overtime Misuse"
              value={formData.teachers_flagged_overtime}
              onChange={(v) => updateField('teachers_flagged_overtime', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records" className="mt-4">
          <SectionCard title="Record Keeping & Documentation">
            <NumberInput
              label="Teacher Records Updated"
              value={formData.teacher_records_updated}
              onChange={(v) => updateField('teacher_records_updated', v)}
            />
            <NumberInput
              label="Training Records Maintained"
              value={formData.training_records_maintained}
              onChange={(v) => updateField('training_records_maintained', v)}
            />
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Compliance Records Complete</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.compliance_records_complete}
                  onChange={(e) => updateField('compliance_records_complete', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{formData.compliance_records_complete ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <NumberInput
              label="Missing Documentation Count"
              value={formData.missing_documentation}
              onChange={(v) => updateField('missing_documentation', v)}
            />
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Report Submitted On Time</Label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.report_submitted_on_time}
                  onChange={(e) => updateField('report_submitted_on_time', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{formData.report_submitted_on_time ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <NumberInput
              label="Pending Approvals"
              value={formData.pending_approvals}
              onChange={(v) => updateField('pending_approvals', v)}
            />
            <NumberInput
              label="Delayed Actions from Previous Month"
              value={formData.delayed_actions}
              onChange={(v) => updateField('delayed_actions', v)}
            />
          </SectionCard>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-4">
          <SectionCard title="Content & R&D (Academic Growth)">
            <NumberInput
              label="Curriculum Updates Proposed"
              value={formData.curriculum_updates_proposed}
              onChange={(v) => updateField('curriculum_updates_proposed', v)}
            />
            <NumberInput
              label="Curriculum Updates Approved"
              value={formData.curriculum_updates_approved}
              onChange={(v) => updateField('curriculum_updates_approved', v)}
            />
            <NumberInput
              label="New Content Created"
              value={formData.new_content_created}
              onChange={(v) => updateField('new_content_created', v)}
            />
            <NumberInput
              label="Website Academic Content Reviewed"
              value={formData.website_content_reviewed}
              onChange={(v) => updateField('website_content_reviewed', v)}
            />
            <NumberInput
              label="Books/Material Reviewed or Updated"
              value={formData.books_material_updated}
              onChange={(v) => updateField('books_material_updated', v)}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-[#0d4f42]/10 text-[#0d4f42]">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Section {['onboarding', 'trials', 'training', 'compliance', 'feedback', 'counselling', 'attendance', 'quality', 'scheduling', 'substitutes', 'overtime', 'records', 'content'].indexOf(activeTab) + 1} of 13
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={activeTab === 'onboarding'}
            onClick={() => {
              const tabs = ['onboarding', 'trials', 'training', 'compliance', 'feedback', 'counselling', 'attendance', 'quality', 'scheduling', 'substitutes', 'overtime', 'records', 'content'];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
            }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={activeTab === 'content'}
            onClick={() => {
              const tabs = ['onboarding', 'trials', 'training', 'compliance', 'feedback', 'counselling', 'attendance', 'quality', 'scheduling', 'substitutes', 'overtime', 'records', 'content'];
              const currentIndex = tabs.indexOf(activeTab);
              if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

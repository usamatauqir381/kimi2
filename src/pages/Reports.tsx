import { useState, useEffect } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ReportsTable } from '@/components/tables/ReportsTable';
import { TNDReportForm } from '@/components/forms/TNDReportForm';
import type { TNDMonthlyReport } from '@/types';
import { tndDb } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ReportsPage() {
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [reports, setReports] = useState<TNDMonthlyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<TNDMonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await tndDb.getReports();
      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleNewReport = () => {
    setSelectedReport(null);
    setView('form');
  };

  const handleViewReport = (report: TNDMonthlyReport) => {
    setSelectedReport(report);
    setView('detail');
  };

  const handleEditReport = (report: TNDMonthlyReport) => {
    setSelectedReport(report);
    setView('form');
  };

  const handleDeleteReport = async (report: TNDMonthlyReport) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      const { error } = await tndDb.deleteReport(report.id);
      if (error) throw error;
      toast.success('Report deleted successfully');
      fetchReports();
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  const handleSubmitReport = async (data: any, status: 'draft' | 'submitted') => {
    try {
      if (selectedReport) {
        // Update existing report
        const { error } = await tndDb.updateReport(selectedReport.id, { ...data, status });
        if (error) throw error;
        toast.success(status === 'submitted' ? 'Report submitted!' : 'Draft saved!');
      } else {
        // Create new report
        const { error } = await tndDb.createReport({ 
          ...data, 
          status,
          submitted_by: 'Current User',
          submitted_at: new Date().toISOString(),
        });
        if (error) throw error;
        toast.success(status === 'submitted' ? 'Report submitted!' : 'Draft saved!');
      }
      setView('list');
      fetchReports();
    } catch (error) {
      throw error;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.month?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.submitted_by?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.year?.toString().includes(searchQuery);
    
    const matchesTab = 
      activeTab === 'all' || 
      report.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  if (view === 'form') {
    return (
      <TNDReportForm
        initialData={selectedReport || undefined}
        onSubmit={handleSubmitReport}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'detail' && selectedReport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" onClick={() => setView('list')} className="mb-2">
              ← Back to Reports
            </Button>
            <h1 className="text-2xl font-bold text-[#0d4f42]">
              {selectedReport.month} {selectedReport.year} Report
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => handleEditReport(selectedReport)}>
              Edit Report
            </Button>
            <Badge 
              variant="outline" 
              className={cn(
                selectedReport.status === 'approved' && 'bg-emerald-100 text-emerald-700',
                selectedReport.status === 'submitted' && 'bg-blue-100 text-blue-700',
                selectedReport.status === 'draft' && 'bg-amber-100 text-amber-700',
              )}
            >
              {selectedReport.status}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Onboarding Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#0d4f42]">Onboarding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">New Teachers</span>
                <span className="font-medium">{selectedReport.onboarding?.new_teachers_onboarded || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Orientation Sessions</span>
                <span className="font-medium">{selectedReport.onboarding?.orientation_sessions || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Batches Completed</span>
                <span className="font-medium">{selectedReport.onboarding?.training_batches_completed || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trainees Passed</span>
                <span className="font-medium">{selectedReport.onboarding?.trainees_passed || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Trials Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#0d4f42]">Trial Classes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trials Assigned</span>
                <span className="font-medium">{selectedReport.trial_classes?.trials_assigned || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trials Evaluated</span>
                <span className="font-medium">{selectedReport.trial_classes?.trials_evaluated || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pass Rate</span>
                <span className="font-medium">{selectedReport.trial_classes?.trial_pass_rate || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">To Live Classes</span>
                <span className="font-medium">{selectedReport.trial_classes?.teachers_to_live || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Training Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#0d4f42]">Ongoing Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Sessions Conducted</span>
                <span className="font-medium">{selectedReport.ongoing_training?.sessions_conducted || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Teachers Trained</span>
                <span className="font-medium">{selectedReport.ongoing_training?.teachers_trained || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Training Hours</span>
                <span className="font-medium">{selectedReport.ongoing_training?.training_hours || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#0d4f42]">Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Teachers Audited</span>
                <span className="font-medium">{selectedReport.compliance?.teachers_audited || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Violations</span>
                <span className="font-medium text-red-600">{selectedReport.compliance?.violations_identified || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Warnings Issued</span>
                <span className="font-medium">{selectedReport.compliance?.warnings_issued || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#0d4f42]">Parent Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Complaints Received</span>
                <span className="font-medium">{selectedReport.parent_feedback?.complaints_received || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Resolved</span>
                <span className="font-medium text-emerald-600">{selectedReport.parent_feedback?.complaints_resolved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Escalated</span>
                <span className="font-medium text-amber-600">{selectedReport.parent_feedback?.complaints_escalated || 0}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quality Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-[#0d4f42]">Quality Assurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Classes Monitored</span>
                <span className="font-medium">{selectedReport.quality_assurance?.classes_monitored || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Grade A Teachers</span>
                <span className="font-medium text-emerald-600">{selectedReport.quality_assurance?.teachers_rated_a || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Red Flag Teachers</span>
                <span className="font-medium text-red-600">{selectedReport.quality_assurance?.qa_red_flag_teachers || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d4f42]">Monthly Reports</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all T&D department reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            size="sm" 
            className="bg-[#0d4f42] hover:bg-[#0d4f42]/90"
            onClick={handleNewReport}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#0d4f42] border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      ) : (
        <ReportsTable
          data={filteredReports}
          onView={handleViewReport}
          onEdit={handleEditReport}
          onDelete={handleDeleteReport}
        />
      )}
    </div>
  );
}

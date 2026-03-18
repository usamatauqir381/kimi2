import { 
  Users, 
  GraduationCap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BookOpen,
  Calendar,
  Plus,
  Download,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { KPICard } from '@/components/dashboard/KPICard';
import { 
  TrialPerformanceChart, 
  QualityDistributionChart, 
  TrainingTrendChart, 
  ComplianceTrendChart,
  GaugeChart,
  MultiMetricChart
} from '@/components/dashboard/Charts';
import { useTNDDashboard } from '@/hooks/useTNDDashboard';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface DashboardProps {
  onNewReport: () => void;
}

export function Dashboard({ onNewReport }: DashboardProps) {
  const { user } = useAuth();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  const { 
    kpis, 
    recentReports, 
    trialPerformance, 
    qualityDistribution, 
    trainingTrend, 
    complianceTrend,
    monthlyStats,
    loading 
  } = useTNDDashboard(currentMonth, currentYear);

  const comparisonData = [
    { name: 'Onboarding', current: monthlyStats.onboarding, previous: Math.floor(monthlyStats.onboarding * 0.9) },
    { name: 'Trials', current: monthlyStats.trials, previous: Math.floor(monthlyStats.trials * 0.85) },
    { name: 'Training', current: monthlyStats.training, previous: Math.floor(monthlyStats.training * 0.95) },
    { name: 'Complaints', current: monthlyStats.complaints, previous: Math.floor(monthlyStats.complaints * 1.1) },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#0d4f42] border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0d4f42]">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.name}. Here&apos;s your department overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button 
            size="sm" 
            className="bg-[#0d4f42] hover:bg-[#0d4f42]/90"
            onClick={onNewReport}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>
        </div>
      </div>

      <Separator />

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Teachers"
          value={kpis.totalTeachers}
          subtitle="Active teaching staff"
          trend="up"
          trendValue="12%"
          trendLabel="vs last month"
          icon={<Users className="h-4 w-4 text-[#0d4f42]" />}
        />
        <KPICard
          title="Trial Pass Rate"
          value={`${kpis.trialPassRate}%`}
          subtitle="Teachers passing trials"
          trend="up"
          trendValue="5%"
          trendLabel="vs last month"
          icon={<CheckCircle className="h-4 w-4 text-emerald-600" />}
          variant="success"
        />
        <KPICard
          title="Compliance Rate"
          value={`${kpis.complianceRate.toFixed(1)}%`}
          subtitle="Policy adherence"
          trend="neutral"
          trendValue="0%"
          trendLabel="vs last month"
          icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
          variant="warning"
        />
        <KPICard
          title="Training Hours"
          value={kpis.trainingHours}
          subtitle="Hours delivered this month"
          trend="up"
          trendValue="18%"
          trendLabel="vs last month"
          icon={<Clock className="h-4 w-4 text-blue-600" />}
          variant="highlight"
        />
      </div>

      {/* Second Row KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Active Teachers"
          value={kpis.activeTeachers}
          subtitle="In live classes"
          icon={<GraduationCap className="h-4 w-4 text-[#0d4f42]" />}
        />
        <KPICard
          title="Quality Score"
          value={kpis.qualityScore.toFixed(1)}
          subtitle="Out of 100"
          trend="up"
          trendValue="2.3"
          trendLabel="vs last month"
          icon={<BookOpen className="h-4 w-4 text-purple-600" />}
        />
        <KPICard
          title="Complaints Resolved"
          value={kpis.complaintsResolved}
          subtitle="Parent feedback handled"
          trend="up"
          trendValue="8"
          trendLabel="vs last month"
          icon={<CheckCircle className="h-4 w-4 text-emerald-600" />}
          variant="success"
        />
        <KPICard
          title="Attendance Compliance"
          value={`${kpis.attendanceCompliance.toFixed(1)}%`}
          subtitle="Punctuality rate"
          trend="down"
          trendValue="1.2%"
          trendLabel="vs last month"
          icon={<Calendar className="h-4 w-4 text-red-600" />}
          variant="danger"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <TrialPerformanceChart 
          data={trialPerformance} 
          className="lg:col-span-1"
        />
        <QualityDistributionChart 
          data={qualityDistribution} 
          className="lg:col-span-1"
        />
        <GaugeChart
          value={kpis.qualityScore}
          max={100}
          title="Overall Quality Score"
          subtitle="Based on QA ratings"
          className="lg:col-span-1"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TrainingTrendChart data={trainingTrend} />
        <ComplianceTrendChart data={complianceTrend} />
      </div>

      {/* Monthly Comparison */}
      <MultiMetricChart data={comparisonData} />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
            <Button variant="ghost" size="sm" className="text-[#0d4f42]">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.length > 0 ? (
              recentReports.slice(0, 5).map((report) => (
                <div 
                  key={report.id} 
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0d4f42]/10">
                      <span className="text-sm font-medium text-[#0d4f42]">
                        {report.month?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{report.month} {report.year}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted by {report.submitted_by}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        report.status === 'approved' && 'bg-emerald-100 text-emerald-700',
                        report.status === 'submitted' && 'bg-blue-100 text-blue-700',
                        report.status === 'draft' && 'bg-amber-100 text-amber-700',
                      )}
                    >
                      {report.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(report.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No reports submitted yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={onNewReport}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Report
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-[#0d4f42] to-[#0d4f42]/80 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">This Month</p>
                <p className="text-2xl font-bold">{monthlyStats.onboarding}</p>
                <p className="text-xs text-white/60">New teachers onboarded</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Trials</p>
                <p className="text-2xl font-bold">{monthlyStats.trials}</p>
                <p className="text-xs text-white/60">Classes assigned</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Training</p>
                <p className="text-2xl font-bold">{monthlyStats.training}</p>
                <p className="text-xs text-white/60">Sessions conducted</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Feedback</p>
                <p className="text-2xl font-bold">{monthlyStats.complaints}</p>
                <p className="text-xs text-white/60">Complaints received</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import type { TNDMonthlyReport, TNDKPIs, ChartData, TrendData } from '@/types';
import { tndDb } from '@/lib/supabase';

interface DashboardData {
  kpis: TNDKPIs;
  recentReports: TNDMonthlyReport[];
  trialPerformance: ChartData[];
  qualityDistribution: ChartData[];
  trainingTrend: TrendData[];
  complianceTrend: TrendData[];
  monthlyStats: {
    onboarding: number;
    trials: number;
    training: number;
    complaints: number;
  };
}

const defaultKPIs: TNDKPIs = {
  totalTeachers: 0,
  activeTeachers: 0,
  trialPassRate: 0,
  complianceRate: 0,
  trainingHours: 0,
  complaintsResolved: 0,
  qualityScore: 0,
  attendanceCompliance: 0,
};

const defaultTrialPerformance: ChartData[] = [
  { name: 'Passed', value: 85, color: '#10b981' },
  { name: 'Failed', value: 15, color: '#ef4444' },
];

const defaultQualityDistribution: ChartData[] = [
  { name: 'Grade A', value: 45, color: '#10b981' },
  { name: 'Grade B', value: 35, color: '#3b82f6' },
  { name: 'Grade C', value: 20, color: '#f59e0b' },
];

const defaultTrainingTrend: TrendData[] = [
  { month: 'Jan', value: 120, target: 100 },
  { month: 'Feb', value: 135, target: 110 },
  { month: 'Mar', value: 150, target: 120 },
  { month: 'Apr', value: 140, target: 130 },
  { month: 'May', value: 165, target: 140 },
  { month: 'Jun', value: 180, target: 150 },
];

const defaultComplianceTrend: TrendData[] = [
  { month: 'Jan', value: 92, target: 95 },
  { month: 'Feb', value: 94, target: 95 },
  { month: 'Mar', value: 96, target: 95 },
  { month: 'Apr', value: 93, target: 95 },
  { month: 'May', value: 97, target: 95 },
  { month: 'Jun', value: 98, target: 95 },
];

export function useTNDDashboard(month: string, year: number) {
  const [data, setData] = useState<DashboardData>({
    kpis: defaultKPIs,
    recentReports: [],
    trialPerformance: defaultTrialPerformance,
    qualityDistribution: defaultQualityDistribution,
    trainingTrend: defaultTrainingTrend,
    complianceTrend: defaultComplianceTrend,
    monthlyStats: {
      onboarding: 0,
      trials: 0,
      training: 0,
      complaints: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch KPIs
      const { data: kpis, error: kpiError } = await tndDb.getKPIs(month, year);
      
      if (kpiError) {
        console.warn('KPI fetch error:', kpiError);
      }

      // Fetch recent reports
      const { data: reports, error: reportsError } = await tndDb.getReports({ 
        month, 
        year,
        status: 'approved' 
      });

      if (reportsError) {
        console.warn('Reports fetch error:', reportsError);
      }

      // Process chart data from reports
      const recentReports = reports || [];
      
      // Trial performance data
      const trialPerformance: ChartData[] = recentReports.length > 0 ? [
        { name: 'Passed', value: recentReports[0]?.trial_classes?.trial_pass_rate || 0, color: '#10b981' },
        { name: 'Failed', value: recentReports[0]?.trial_classes?.trial_fail_rate || 0, color: '#ef4444' },
      ] : defaultTrialPerformance;

      // Quality distribution
      const qualityDistribution: ChartData[] = recentReports.length > 0 ? [
        { name: 'Grade A', value: recentReports[0]?.quality_assurance?.teachers_rated_a || 0, color: '#10b981' },
        { name: 'Grade B', value: recentReports[0]?.quality_assurance?.teachers_rated_b || 0, color: '#3b82f6' },
        { name: 'Grade C', value: recentReports[0]?.quality_assurance?.teachers_rated_c || 0, color: '#f59e0b' },
      ] : defaultQualityDistribution;

      // Monthly stats
      const monthlyStats = {
        onboarding: recentReports[0]?.onboarding?.new_teachers_onboarded || 0,
        trials: recentReports[0]?.trial_classes?.trials_assigned || 0,
        training: recentReports[0]?.ongoing_training?.sessions_conducted || 0,
        complaints: recentReports[0]?.parent_feedback?.complaints_received || 0,
      };

      setData({
        kpis: kpis || defaultKPIs,
        recentReports,
        trialPerformance,
        qualityDistribution,
        trainingTrend: defaultTrainingTrend,
        complianceTrend: defaultComplianceTrend,
        monthlyStats,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}

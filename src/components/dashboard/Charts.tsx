import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Trial Performance Pie Chart
interface TrialPerformanceChartProps {
  data: { name: string; value: number; color: string }[];
  className?: string;
}

export function TrialPerformanceChart({ data, className }: TrialPerformanceChartProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Trial Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Quality Distribution Donut Chart
interface QualityDistributionChartProps {
  data: { name: string; value: number; color: string }[];
  className?: string;
}

export function QualityDistributionChart({ data, className }: QualityDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Teacher Quality Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Total Teachers: <span className="font-semibold text-foreground">{total}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Training Trend Bar Chart
interface TrainingTrendChartProps {
  data: { month: string; value: number; target?: number }[];
  className?: string;
}

export function TrainingTrendChart({ data, className }: TrainingTrendChartProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Training Hours Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Actual" fill="#0d4f42" radius={[4, 4, 0, 0]} />
            {data[0]?.target !== undefined && (
              <Bar dataKey="target" name="Target" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Compliance Trend Line Chart
interface ComplianceTrendChartProps {
  data: { month: string; value: number; target?: number }[];
  className?: string;
}

export function ComplianceTrendChart({ data, className }: ComplianceTrendChartProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Compliance Rate Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d4f42" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d4f42" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              name="Compliance %"
              stroke="#0d4f42"
              fillOpacity={1}
              fill="url(#colorValue)"
            />
            {data[0]?.target !== undefined && (
              <Area
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#ef4444"
                fill="transparent"
                strokeDasharray="5 5"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Gauge Chart for KPI
interface GaugeChartProps {
  value: number;
  max: number;
  title: string;
  subtitle?: string;
  className?: string;
}

export function GaugeChart({ value, max, title, subtitle, className }: GaugeChartProps) {
  const percentage = (value / max) * 100;
  const color = percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={[
                { name: 'Value', value: percentage },
                { name: 'Remaining', value: 100 - percentage },
              ]}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="-mt-8 text-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {value.toFixed(1)}%
          </span>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// Multi-metric Bar Chart
interface MultiMetricChartProps {
  data: { name: string; current: number; previous: number }[];
  className?: string;
}

export function MultiMetricChart({ data, className }: MultiMetricChartProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="text-base font-medium">Monthly Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" name="Current Month" fill="#0d4f42" radius={[4, 4, 0, 0]} />
            <Bar dataKey="previous" name="Previous Month" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

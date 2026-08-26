"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

interface ChartData {
  month: string;
  total: number;
}

export function MonthlyChart({ data }: { data: ChartData[] }) {
  const router = useRouter();

  const handleClick = (dataPoint: any) => {
    if (dataPoint && dataPoint.activePayload && dataPoint.activePayload.length > 0) {
      router.push(`/?month=${dataPoint.activePayload[0].payload.month}`);
    }
  };

  return (
    <div style={{ height: 350, width: '100%', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', border: '1px solid var(--border)' }}>
      <h3 style={{ color: 'var(--foreground)', margin: '0 0 1rem 0', textAlign: 'center', fontSize: '1.125rem', fontWeight: 600 }}>Monthly Trend</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          onClick={handleClick}
          style={{ cursor: 'pointer' }}
          margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" stroke="#8c8f96" fontSize={12} tickMargin={10} />
          <YAxis stroke="#8c8f96" fontSize={12} tickFormatter={(value) => `$${value}`} />
          <Tooltip 
            formatter={(value: any) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
            contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: 'var(--radius-md)' }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

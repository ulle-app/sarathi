'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CareerRecommendation } from '@/types/career';

interface CareerMatchChartProps {
  recommendations: CareerRecommendation[];
  maxItems?: number;
}

const getColorByScore = (score: number): string => {
  if (score >= 0.8) return '#10b981'; // emerald
  if (score >= 0.6) return '#6366f1'; // indigo
  if (score >= 0.4) return '#f97316'; // orange
  return '#ef4444'; // red
};

export function CareerMatchChart({ recommendations, maxItems = 5 }: CareerMatchChartProps) {
  const data = recommendations.slice(0, maxItems).map((rec) => ({
    name: rec.career.title,
    score: Math.round(rec.matchScore * 100),
    personality: Math.round(rec.fitFactors.personality * 100),
    skills: Math.round(rec.fitFactors.skills * 100),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11 }}
            width={110}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const label = name === 'score' ? 'Match Score' : name.charAt(0).toUpperCase() + name.slice(1);
              return [`${value}%`, label];
            }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          />
          <Bar dataKey="score" name="Match Score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorByScore(entry.score / 100)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

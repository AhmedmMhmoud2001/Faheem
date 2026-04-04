import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const MONTH_KEYS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul'];
const SERIES = [
  { s1: -630, s2: -800 },
  { s1: -460, s2: 0 },
  { s1: 200, s2: 520 },
  { s1: 60, s2: 400 },
  { s1: 550, s2: -660 },
  { s1: -270, s2: -450 },
  { s1: -490, s2: -500 },
];

const AXIS_STYLE = { fontSize: 11, fill: '#64748b' };

export default function ProfileProgressChart({ t }) {
  const data = useMemo(
    () =>
      MONTH_KEYS.map((key, i) => ({
        month: t(`profile.months.${key}`),
        series1: SERIES[i].s1,
        series2: SERIES[i].s2,
      })),
    [t],
  );

  return (
    <div className="w-full min-h-[320px] md:min-h-[380px]" dir="ltr">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'inherit' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            yAxisId="left"
            domain={[-800, 600]}
            tick={AXIS_STYLE}
            axisLine={{ stroke: '#cbd5e1' }}
            width={44}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[-1000, 800]}
            tick={AXIS_STYLE}
            axisLine={{ stroke: '#cbd5e1' }}
            width={44}
          />
          <Tooltip
            contentStyle={{
              fontFamily: 'inherit',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              direction: 'inherit',
            }}
          />
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: 12, fontFamily: 'inherit' }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="series1"
            name={t('profile.progressChart.dataset1')}
            stroke="#FFD131"
            strokeWidth={2}
            dot={{ r: 5, fill: '#FFD131', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="series2"
            name={t('profile.progressChart.dataset2')}
            stroke="#2D3142"
            strokeWidth={2}
            dot={{ r: 5, fill: '#2D3142', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

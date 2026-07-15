'use client'

import dynamic from 'next/dynamic'

const BarChartPkg = dynamic(() => import('recharts').then(m => ({
  default: ({ children, ...p }: Parameters<typeof import('recharts').BarChart>[0]) => {
    const { BarChart } = require('recharts')
    return <BarChart {...p}>{children}</BarChart>
  }
})), { ssr: false })

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'

const COLORS = ['#B8975A', '#10B981', '#EF4444', '#8B5CF6', '#6B7280']

type Props = {
  monthlyData:       { month: string; requests: number; approved: number; nights: number }[]
  statusBreakdown:   Record<string, number>
  activityBreakdown: Record<string, number>
  totalGuests:       number
}

export default function AnalyticsCharts({ monthlyData, statusBreakdown, activityBreakdown, totalGuests }: Props) {
  const statusData   = Object.entries(statusBreakdown).map(([name, value]) => ({ name, value }))
  const activityData = Object.entries(activityBreakdown).map(([name, value]) => ({ name, value }))

  const tooltipStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    color: 'var(--text-1)',
    fontSize: 12,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  }
  const labelStyle: React.CSSProperties = { color: 'var(--text-2)', fontSize: 11 }
  const axisStyle = { fill: 'var(--text-3)', fontSize: 11 }

  return (
    <div className="space-y-6">
      {/* Monthly requests vs approved */}
      <div className="card p-6">
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 24 }}>
          Monthly booking activity
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={4}>
            <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisStyle} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={labelStyle}
              cursor={{ fill: 'var(--bg-hover)' }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: 'var(--text-3)', paddingTop: 16 }}
            />
            <Bar dataKey="requests" name="Requests" fill="#B8975A" opacity={0.5} radius={[4,4,0,0]} />
            <Bar dataKey="approved" name="Approved" fill="#B8975A" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Nights booked by month */}
      <div className="card p-6">
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 24 }}>
          Nights booked per month
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={axisStyle} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} cursor={{ fill: 'var(--bg-hover)' }} />
            <Bar dataKey="nights" name="Nights" fill="#10B981" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="card p-6">
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 24 }}>Status breakdown</h3>
          {statusData.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-4)' }}>No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-3)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Activity breakdown */}
        <div className="card p-6">
          <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 24 }}>Activity types</h3>
          {activityData.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--text-4)' }}>No activity logged yet</p>
          ) : (
            <div className="space-y-3">
              {activityData.map((a, i) => {
                const max   = Math.max(...activityData.map(d => d.value))
                const pct   = Math.round((a.value / max) * 100)
                return (
                  <div key={a.name}>
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{a.name.replace(/_/g, ' ')}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'monospace' }}>{a.value}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 9999, background: 'var(--bg-elevated)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: 9999, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

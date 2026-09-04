"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

const COLORS = ['#3b82f6', '#10b981', '#eab308', '#f97316', '#ef4444']

export function DashboardCharts({ 
  computerStats,
  softwareStats
}: { 
  computerStats: any,
  softwareStats: any
}) {
  const pieData = [
    { name: 'In Use', value: computerStats.inUse },
    { name: 'Available', value: computerStats.available },
    { name: 'Not In Use', value: computerStats.notInUse },
    { name: 'Under Repair', value: computerStats.underRepair },
    { name: 'Retired', value: computerStats.retired },
  ].filter(d => d.value > 0)

  const barData = [
    { name: 'In Use', value: softwareStats.inUse },
    { name: 'Available', value: softwareStats.available },
    { name: 'Expiring Soon', value: softwareStats.expiringSoon },
    { name: 'Expired', value: softwareStats.expired },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700 fill-mode-both">
      {/* Computer Status Chart */}
      <div className="glass-card rounded-xl p-6 border-t-4 border-t-primary/80">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          Computer Distribution
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="rgba(255,255,255,0.1)"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Software Licenses Chart */}
      <div className="glass-card rounded-xl p-6 border-t-4 border-t-primary/80">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
          Software License Status
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.7 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.7 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', color: '#fff' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

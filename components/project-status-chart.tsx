"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface ProjectStatusChartProps {
  draft: number
  ongoing: number
  completed: number
}

export function ProjectStatusChart({ draft, ongoing, completed }: ProjectStatusChartProps) {
  const data = [
    { name: "Draft", value: draft, color: "#f97316" },
    { name: "Proses", value: ongoing, color: "#3b82f6" },
    { name: "Selesai", value: completed, color: "#22c55e" },
  ].filter((item) => item.value > 0)

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Belum ada data proyek</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, "Jumlah Proyek"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

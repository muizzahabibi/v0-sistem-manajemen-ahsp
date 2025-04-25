"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    material: 4000,
    tukang: 2400,
  },
  {
    name: "Feb",
    material: 3000,
    tukang: 1398,
  },
  {
    name: "Mar",
    material: 2000,
    tukang: 9800,
  },
  {
    name: "Apr",
    material: 2780,
    tukang: 3908,
  },
  {
    name: "Mei",
    material: 1890,
    tukang: 4800,
  },
  {
    name: "Jun",
    material: 2390,
    tukang: 3800,
  },
]

export function DashboardChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) =>
            new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(value as number)
          }
        />
        <Legend />
        <Bar dataKey="material" name="Biaya Material" fill="#8884d8" />
        <Bar dataKey="tukang" name="Biaya Tukang" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

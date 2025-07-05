"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
} from "recharts"

// Mock data for charts
const priceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  price: 0.00234 + Math.sin(i * 0.5) * 0.0005 + Math.random() * 0.0002,
  volume: Math.floor(Math.random() * 100000) + 50000,
}))

const buyVsSellData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i * 2}:00`,
  buys: Math.floor(Math.random() * 50) + 20,
  sells: Math.floor(Math.random() * 40) + 15,
}))

const walletActivityData = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  activeWallets: Math.floor(Math.random() * 20) + 25,
  newWallets: Math.floor(Math.random() * 10) + 3,
}))

const protocolData = [
  { name: "Jupiter", value: 456, color: "#f97316" },
  { name: "Raydium", value: 398, color: "#8b5cf6" },
  { name: "Orca", value: 234, color: "#3b82f6" },
  { name: "Others", value: 159, color: "#6b7280" },
]

interface AnalyticsChartsProps {
  detailed?: boolean
}

export function AnalyticsCharts({ detailed = false }: AnalyticsChartsProps) {
  const [timeframe, setTimeframe] = useState("24h")

  return (
    <div className="space-y-6">
      {detailed && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Market Analytics</h3>
            <p className="text-sm text-muted-foreground">Comprehensive analysis of token activity and market trends</p>
          </div>
          <div className="flex items-center space-x-2">
            {["1h", "24h", "7d", "30d"].map((tf) => (
              <Badge
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="price" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="price">Price & Volume</TabsTrigger>
          <TabsTrigger value="activity">Buy/Sell Activity</TabsTrigger>
          <TabsTrigger value="wallets">Wallet Activity</TabsTrigger>
          <TabsTrigger value="protocols">Protocol Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="price" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Price Movement</CardTitle>
                <CardDescription>Token price over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={["dataMin - 0.0001", "dataMax + 0.0001"]} />
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(6)}`, "Price"]} />
                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Volume</CardTitle>
                <CardDescription>Trading volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [value.toLocaleString(), "Volume"]} />
                    <Area type="monotone" dataKey="volume" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Buy vs Sell Activity</CardTitle>
              <CardDescription>Transaction distribution over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={buyVsSellData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="buys" fill="#10b981" name="Buys" />
                  <Bar dataKey="sells" fill="#ef4444" name="Sells" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wallet Activity</CardTitle>
              <CardDescription>Active and new wallet trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={walletActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="activeWallets"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    name="Active Wallets"
                  />
                  <Area
                    type="monotone"
                    dataKey="newWallets"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    name="New Wallets"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Protocol Distribution</CardTitle>
                <CardDescription>Transaction share by protocol</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={protocolData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {protocolData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Protocol Comparison</CardTitle>
                <CardDescription>Transaction count by protocol</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={protocolData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

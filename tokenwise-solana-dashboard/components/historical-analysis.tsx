"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, Search } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import type { DateRange } from "react-day-picker"

// Mock historical data
const generateHistoricalData = (days: number) => {
  const data = []
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split("T")[0],
      transactions: Math.floor(Math.random() * 100) + 50,
      volume: Math.floor(Math.random() * 1000000) + 500000,
      uniqueWallets: Math.floor(Math.random() * 30) + 20,
      avgPrice: 0.00234 + (Math.random() - 0.5) * 0.001,
    })
  }
  return data
}

export function HistoricalAnalysis() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [selectedMetric, setSelectedMetric] = useState("transactions")
  const [walletFilter, setWalletFilter] = useState("")
  const [protocolFilter, setProtocolFilter] = useState("all")
  const [historicalData] = useState(generateHistoricalData(30))

  const filteredData = historicalData.filter((item) => {
    const itemDate = new Date(item.date)
    const fromDate = dateRange?.from
    const toDate = dateRange?.to

    if (fromDate && itemDate < fromDate) return false
    if (toDate && itemDate > toDate) return false

    return true
  })

  const totalTransactions = filteredData.reduce((sum, item) => sum + item.transactions, 0)
  const totalVolume = filteredData.reduce((sum, item) => sum + item.volume, 0)
  const avgUniqueWallets = filteredData.reduce((sum, item) => sum + item.uniqueWallets, 0) / filteredData.length
  const avgPrice = filteredData.reduce((sum, item) => sum + item.avgPrice, 0) / filteredData.length

  const exportData = (format: "csv" | "json") => {
    const dataToExport = filteredData.map((item) => ({
      date: item.date,
      transactions: item.transactions,
      volume: item.volume,
      unique_wallets: item.uniqueWallets,
      avg_price: item.avgPrice,
    }))

    if (format === "csv") {
      const headers = Object.keys(dataToExport[0]).join(",")
      const rows = dataToExport.map((row) => Object.values(row).join(","))
      const csv = [headers, ...rows].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tokenwise-historical-${Date.now()}.csv`
      a.click()
    } else {
      const json = JSON.stringify(dataToExport, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tokenwise-historical-${Date.now()}.json`
      a.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Query Filters</CardTitle>
          <CardDescription>Customize your historical analysis with time and wallet filters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>

            <div className="space-y-2">
              <Label>Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="wallets">Unique Wallets</SelectItem>
                  <SelectItem value="price">Average Price</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Protocol</Label>
              <Select value={protocolFilter} onValueChange={setProtocolFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Protocols</SelectItem>
                  <SelectItem value="jupiter">Jupiter</SelectItem>
                  <SelectItem value="raydium">Raydium</SelectItem>
                  <SelectItem value="orca">Orca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by wallet..."
                  value={walletFilter}
                  onChange={(e) => setWalletFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{filteredData.length} days selected</Badge>
              <Badge variant="outline">{totalTransactions} total transactions</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => exportData("csv")}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportData("json")}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{filteredData.length} days period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Cumulative trading volume</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Unique Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgUniqueWallets)}</div>
            <p className="text-xs text-muted-foreground">Daily average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgPrice.toFixed(6)}</div>
            <p className="text-xs text-muted-foreground">Period average</p>
          </CardContent>
        </Card>
      </div>

      {/* Historical Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historical Data</CardTitle>
          <CardDescription>Daily breakdown of token activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-right p-3 font-medium">Transactions</th>
                    <th className="text-right p-3 font-medium">Volume</th>
                    <th className="text-right p-3 font-medium">Unique Wallets</th>
                    <th className="text-right p-3 font-medium">Avg Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={item.date} className={index % 2 === 0 ? "bg-muted/25" : ""}>
                      <td className="p-3 font-mono">{item.date}</td>
                      <td className="p-3 text-right font-mono">{item.transactions}</td>
                      <td className="p-3 text-right font-mono">${item.volume.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">{item.uniqueWallets}</td>
                      <td className="p-3 text-right font-mono">${item.avgPrice.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

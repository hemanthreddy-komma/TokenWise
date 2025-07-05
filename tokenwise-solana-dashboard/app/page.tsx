"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Activity, Wallet, BarChart3, Download, RefreshCw, DollarSign } from "lucide-react"
import { TopHoldersTable } from "@/components/top-holders-table"
import { TransactionFeed } from "@/components/transaction-feed"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { ProtocolBreakdown } from "@/components/protocol-breakdown"
import { HistoricalAnalysis } from "@/components/historical-analysis"
import { ExportDialog } from "@/components/export-dialog"

// Mock data for demonstration
const mockStats = {
  totalHolders: 60,
  totalTransactions: 1247,
  buyTransactions: 789,
  sellTransactions: 458,
  netDirection: "buy-heavy",
  activeWallets: 34,
  totalVolume: 2847392.45,
}

const mockProtocols = [
  { name: "Jupiter", transactions: 456, percentage: 36.6 },
  { name: "Raydium", transactions: 398, percentage: 31.9 },
  { name: "Orca", transactions: 234, percentage: 18.8 },
  { name: "Others", transactions: 159, percentage: 12.7 },
]

export default function Dashboard() {
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [showExportDialog, setShowExportDialog] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold">TokenWise</h1>
                  <p className="text-sm text-muted-foreground">Real-Time Wallet Intelligence</p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                9BB6NFE...bgpump
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Last Update</p>
                <p className="font-mono">{lastUpdate.toLocaleTimeString()}</p>
              </div>
              <Button
                variant={isMonitoring ? "default" : "outline"}
                size="sm"
                onClick={toggleMonitoring}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isMonitoring ? "animate-spin" : ""}`} />
                <span>{isMonitoring ? "Monitoring" : "Paused"}</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockStats.totalVolume.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeWallets}</div>
              <p className="text-xs text-muted-foreground">of {mockStats.totalHolders} total holders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Buy/Sell Ratio</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {(mockStats.buyTransactions / mockStats.sellTransactions).toFixed(2)}:1
              </div>
              <p className="text-xs text-muted-foreground">
                {mockStats.buyTransactions} buys / {mockStats.sellTransactions} sells
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Bullish</div>
              <Progress value={(mockStats.buyTransactions / mockStats.totalTransactions) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holders">Top Holders</TabsTrigger>
            <TabsTrigger value="transactions">Live Feed</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Protocol Usage</CardTitle>
                  <CardDescription>Distribution of transactions across DEX protocols</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProtocolBreakdown protocols={mockProtocols} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest transactions from monitored wallets</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionFeed limit={5} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Market Trends</CardTitle>
                <CardDescription>Real-time price and volume analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsCharts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holders">
            <Card>
              <CardHeader>
                <CardTitle>Top 60 Token Holders</CardTitle>
                <CardDescription>Ranked by token balance with real-time activity monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <TopHoldersTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Live Transaction Feed</CardTitle>
                <CardDescription>Real-time monitoring of buy/sell activities</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionFeed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed market analysis and wallet behavior insights</CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsCharts detailed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historical">
            <Card>
              <CardHeader>
                <CardTitle>Historical Analysis</CardTitle>
                <CardDescription>Query past activity with custom time filters</CardDescription>
              </CardHeader>
              <CardContent>
                <HistoricalAnalysis />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />
    </div>
  )
}

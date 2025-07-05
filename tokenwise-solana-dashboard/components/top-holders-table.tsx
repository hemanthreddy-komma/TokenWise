"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Search, TrendingUp, TrendingDown, Minus } from "lucide-react"

// Mock data for top holders
const generateMockHolders = () => {
  const holders = []
  for (let i = 1; i <= 60; i++) {
    const balance = Math.floor(Math.random() * 1000000) + 10000
    const change24h = (Math.random() - 0.5) * 20
    holders.push({
      rank: i,
      address: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      balance: balance,
      percentage: ((balance / 50000000) * 100).toFixed(2),
      change24h: change24h,
      lastActivity: new Date(Date.now() - Math.random() * 86400000 * 7),
      isActive: Math.random() > 0.6,
    })
  }
  return holders.sort((a, b) => b.balance - a.balance)
}

export function TopHoldersTable() {
  const [holders] = useState(generateMockHolders())
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const filteredHolders = holders.filter((holder) => holder.address.toLowerCase().includes(searchTerm.toLowerCase()))

  const paginatedHolders = filteredHolders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredHolders.length / itemsPerPage)

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-400"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Badge variant="secondary">{filteredHolders.length} wallets</Badge>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Wallet Address</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-right">% of Supply</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedHolders.map((holder) => (
              <TableRow key={holder.address}>
                <TableCell className="font-medium">#{holder.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {holder.address.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-mono text-sm">{holder.address}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{holder.balance.toLocaleString()}</TableCell>
                <TableCell className="text-right">{holder.percentage}%</TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end space-x-1 ${getTrendColor(holder.change24h)}`}>
                    {getTrendIcon(holder.change24h)}
                    <span className="font-mono text-sm">
                      {holder.change24h > 0 ? "+" : ""}
                      {holder.change24h.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {holder.lastActivity.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={holder.isActive ? "default" : "secondary"}>
                    {holder.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredHolders.length)} of {filteredHolders.length} wallets
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

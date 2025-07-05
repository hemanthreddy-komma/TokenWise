"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Database } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps) {
  const [exportFormat, setExportFormat] = useState("csv")
  const [exportData, setExportData] = useState({
    topHolders: true,
    transactions: true,
    analytics: false,
    historical: false,
  })

  const handleExport = () => {
    // Simulate export functionality
    const filename = `tokenwise-export-${Date.now()}.${exportFormat}`

    // Create mock data based on selections
    const mockData = {
      metadata: {
        token: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
        exportDate: new Date().toISOString(),
        dataTypes: Object.entries(exportData)
          .filter(([_, selected]) => selected)
          .map(([key, _]) => key),
      },
      topHolders: exportData.topHolders
        ? Array.from({ length: 60 }, (_, i) => ({
            rank: i + 1,
            address: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
            balance: Math.floor(Math.random() * 1000000) + 10000,
            percentage: (Math.random() * 5 + 0.1).toFixed(2),
          }))
        : undefined,
      transactions: exportData.transactions
        ? Array.from({ length: 100 }, (_, i) => ({
            timestamp: new Date(Date.now() - i * 60000).toISOString(),
            type: Math.random() > 0.6 ? "buy" : "sell",
            wallet: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
            amount: Math.floor(Math.random() * 50000) + 1000,
            protocol: ["Jupiter", "Raydium", "Orca"][Math.floor(Math.random() * 3)],
          }))
        : undefined,
    }

    if (exportFormat === "csv") {
      // Convert to CSV format
      let csvContent = ""

      if (exportData.topHolders && mockData.topHolders) {
        csvContent += "TOP HOLDERS\n"
        csvContent += "Rank,Address,Balance,Percentage\n"
        mockData.topHolders.forEach((holder) => {
          csvContent += `${holder.rank},${holder.address},${holder.balance},${holder.percentage}%\n`
        })
        csvContent += "\n"
      }

      if (exportData.transactions && mockData.transactions) {
        csvContent += "TRANSACTIONS\n"
        csvContent += "Timestamp,Type,Wallet,Amount,Protocol\n"
        mockData.transactions.forEach((tx) => {
          csvContent += `${tx.timestamp},${tx.type},${tx.wallet},${tx.amount},${tx.protocol}\n`
        })
      }

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
    } else {
      // JSON format
      const jsonContent = JSON.stringify(mockData, null, 2)
      const blob = new Blob([jsonContent], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
    }

    onOpenChange(false)
  }

  const selectedCount = Object.values(exportData).filter(Boolean).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </DialogTitle>
          <DialogDescription>Choose the data types and format for your export</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>CSV Format</span>
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span>JSON Format</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Data to Export</Label>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="topHolders"
                  checked={exportData.topHolders}
                  onCheckedChange={(checked) => setExportData((prev) => ({ ...prev, topHolders: checked as boolean }))}
                />
                <Label htmlFor="topHolders" className="text-sm">
                  Top 60 Holders Data
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transactions"
                  checked={exportData.transactions}
                  onCheckedChange={(checked) =>
                    setExportData((prev) => ({ ...prev, transactions: checked as boolean }))
                  }
                />
                <Label htmlFor="transactions" className="text-sm">
                  Transaction History
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="analytics"
                  checked={exportData.analytics}
                  onCheckedChange={(checked) => setExportData((prev) => ({ ...prev, analytics: checked as boolean }))}
                />
                <Label htmlFor="analytics" className="text-sm">
                  Analytics Summary
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="historical"
                  checked={exportData.historical}
                  onCheckedChange={(checked) => setExportData((prev) => ({ ...prev, historical: checked as boolean }))}
                />
                <Label htmlFor="historical" className="text-sm">
                  Historical Analysis
                </Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <Badge variant="outline">
              {selectedCount} data type{selectedCount !== 1 ? "s" : ""} selected
            </Badge>
            <p className="text-xs text-muted-foreground">Export will include metadata and timestamps</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={selectedCount === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

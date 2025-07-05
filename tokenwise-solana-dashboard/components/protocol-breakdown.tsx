"use client"

import type React from "react"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Protocol {
  name: string
  transactions: number
  percentage: number
}

interface ProtocolBreakdownProps {
  protocols: Protocol[]
}

export function ProtocolBreakdown({ protocols }: ProtocolBreakdownProps) {
  const getProtocolColor = (name: string) => {
    const colors = {
      Jupiter: "bg-orange-500",
      Raydium: "bg-purple-500",
      Orca: "bg-blue-500",
      Others: "bg-gray-500",
    }
    return colors[name as keyof typeof colors] || "bg-gray-500"
  }

  const getBadgeColor = (name: string) => {
    const colors = {
      Jupiter: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      Raydium: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      Orca: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Others: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    }
    return colors[name as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      {protocols.map((protocol) => (
        <div key={protocol.name} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={getBadgeColor(protocol.name)}>{protocol.name}</Badge>
              <span className="text-sm font-medium">{protocol.transactions} transactions</span>
            </div>
            <span className="text-sm font-semibold">{protocol.percentage}%</span>
          </div>
          <Progress
            value={protocol.percentage}
            className="h-2"
            style={
              {
                "--progress-background": getProtocolColor(protocol.name),
              } as React.CSSProperties
            }
          />
        </div>
      ))}

      <div className="pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Total Transactions</span>
          <span className="font-semibold">{protocols.reduce((sum, p) => sum + p.transactions, 0)}</span>
        </div>
      </div>
    </div>
  )
}

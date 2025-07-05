"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  type: "buy" | "sell"
  wallet: string
  amount: number
  price: number
  protocol: string
  timestamp: Date
  txHash: string
}

const protocols = ["Jupiter", "Raydium", "Orca", "Serum"]

const generateMockTransaction = (): Transaction => {
  const type = Math.random() > 0.6 ? "buy" : "sell"
  return {
    id: Math.random().toString(36).substring(2, 15),
    type,
    wallet: `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
    amount: Math.floor(Math.random() * 50000) + 1000,
    price: 0.00234 + (Math.random() - 0.5) * 0.001,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    timestamp: new Date(),
    txHash: Math.random().toString(36).substring(2, 15),
  }
}

interface TransactionFeedProps {
  limit?: number
}

export function TransactionFeed({ limit }: TransactionFeedProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Initialize with some mock transactions
    const initialTransactions = Array.from({ length: 20 }, generateMockTransaction).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    )
    setTransactions(initialTransactions)

    // Simulate real-time updates
    const interval = setInterval(
      () => {
        const newTransaction = generateMockTransaction()
        setTransactions((prev) => [newTransaction, ...prev].slice(0, 100))
      },
      3000 + Math.random() * 5000,
    )

    return () => clearInterval(interval)
  }, [])

  const displayTransactions = limit ? transactions.slice(0, limit) : transactions

  const getTypeIcon = (type: "buy" | "sell") => {
    return type === "buy" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTypeColor = (type: "buy" | "sell") => {
    return type === "buy" ? "text-green-600" : "text-red-600"
  }

  const getProtocolColor = (protocol: string) => {
    const colors = {
      Jupiter: "bg-orange-100 text-orange-800",
      Raydium: "bg-purple-100 text-purple-800",
      Orca: "bg-blue-100 text-blue-800",
      Serum: "bg-green-100 text-green-800",
    }
    return colors[protocol as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-3">
          {displayTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(tx.type)}
                  <span className={`font-semibold uppercase text-sm ${getTypeColor(tx.type)}`}>{tx.type}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{tx.wallet.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="font-mono text-sm">{tx.wallet}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-mono font-semibold">{tx.amount.toLocaleString()} tokens</p>
                  <p className="text-sm text-muted-foreground">@ ${tx.price.toFixed(6)}</p>
                </div>

                <Badge className={getProtocolColor(tx.protocol)}>{tx.protocol}</Badge>

                <div className="text-right text-sm text-muted-foreground">
                  <p>{tx.timestamp.toLocaleTimeString()}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => window.open(`https://solscan.io/tx/${tx.txHash}`, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {!limit && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Showing latest {displayTransactions.length} transactions</p>
        </div>
      )}
    </div>
  )
}

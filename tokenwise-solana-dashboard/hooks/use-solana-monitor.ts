"use client"

import { useState, useEffect, useCallback } from "react"
import { SolanaTokenMonitor, type TokenHolder, type Transaction } from "@/lib/solana-client"

const TOKEN_ADDRESS = "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump"

export function useSolanaMonitor() {
  const [monitor] = useState(() => new SolanaTokenMonitor(TOKEN_ADDRESS))
  const [topHolders, setTopHolders] = useState<TokenHolder[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTopHolders = useCallback(async () => {
    try {
      setIsLoading(true)
      const holders = await monitor.getTopHolders(60)
      setTopHolders(holders)
      setError(null)
    } catch (err) {
      setError("Failed to load top holders")
      console.error("Error loading top holders:", err)
    } finally {
      setIsLoading(false)
    }
  }, [monitor])

  const startTransactionMonitoring = useCallback(async () => {
    try {
      await monitor.subscribeToTransactions((transaction) => {
        setRecentTransactions((prev) => [transaction, ...prev].slice(0, 100))
      })
      setIsConnected(true)
      setError(null)
    } catch (err) {
      setError("Failed to start transaction monitoring")
      console.error("Error starting transaction monitoring:", err)
    }
  }, [monitor])

  const getHistoricalData = useCallback(
    async (fromDate: Date, toDate: Date) => {
      try {
        return await monitor.getHistoricalData(fromDate, toDate)
      } catch (err) {
        setError("Failed to fetch historical data")
        console.error("Error fetching historical data:", err)
        return []
      }
    },
    [monitor],
  )

  useEffect(() => {
    loadTopHolders()
    startTransactionMonitoring()

    return () => {
      monitor.disconnect()
    }
  }, [loadTopHolders, startTransactionMonitoring, monitor])

  return {
    topHolders,
    recentTransactions,
    isConnected,
    isLoading,
    error,
    loadTopHolders,
    getHistoricalData,
    monitor,
  }
}

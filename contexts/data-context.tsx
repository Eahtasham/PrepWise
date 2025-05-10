"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { getCurrentUser } from "@/lib/actions/auth.action"
import { getFeedbackByUserId, getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action"

// Define the context type
interface DataContextType {
  user: any | null
  userInterviews: any[] | null
  latestInterviews: any[] | null
  userFeedbacks: Feedback[] | null
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

// Create the context with a default value
const DataContext = createContext<DataContextType | undefined>(undefined)

// Provider component
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [userInterviews, setUserInterviews] = useState<any[] | null>(null)
  const [userFeedbacks, setUserFeedbacks] = useState<Feedback[] | null>(null)
  const [latestInterviews, setLatestInterviews] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const userData = await getCurrentUser()

      if (!userData) {
        setLoading(false)
        return
      }

      setUser(userData)

      // Fetch interviews in parallel
      const [interviews, scheduledInterviews, feedbacks] = await Promise.all([
        getInterviewsByUserId(userData.id),
        getLatestInterviews({ userId: userData.id }),
        getFeedbackByUserId({ userId: userData.id }),
      ])

      setUserInterviews(interviews)
      setLatestInterviews(scheduledInterviews)
      setUserFeedbacks(feedbacks)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Function to refresh data (can be called after mutations)
  const refreshData = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  // Fetch data on initial load
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Provide the context value
  const value = {
    user,
    userInterviews,
    latestInterviews,
    userFeedbacks,
    loading,
    error,
    refreshData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// Custom hook to use the data context
export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

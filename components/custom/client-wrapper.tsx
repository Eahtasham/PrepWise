"use client"

import { ReactNode } from "react"
import { DataProvider } from "@/contexts/data-context"

export function ClientWrapper({ children }: { children: ReactNode }) {
  return <DataProvider>{children}</DataProvider>
}

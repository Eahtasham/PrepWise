"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, ListTodo, Receipt, Settings, Plus, Menu, X, Bell, LogOut, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getCurrentUser, signOut } from "@/lib/actions/auth.action"
import { ScheduleInterviewModal } from "./schedule-interview-modal"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Scheduled Interviews",
    href: "/dashboard/scheduled",
    icon: Calendar,
  },
  {
    title: "All Interviews",
    href: "/dashboard/all-interviews",
    icon: ListTodo,
  },
  // {
  //   title: "Billing",
  //   href: "/dashboard/billing",
  //   icon: Receipt,
  // },
  // {
  //   title: "Settings",
  //   href: "/dashboard/settings",
  //   icon: Settings,
  // },
]

export function DashboardShell({ children, user }: { children: React.ReactNode, user: any }) {
  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-1 min-h-0 bg-stone-950 border-r border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-semibold text-teal-500">PrepWise</span>
            </Link>
          </div>
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="px-6 w-full mb-6 flex items-center justify-center">
            <ScheduleInterviewModal user={user} />
            </div>
            <nav className="mt-2 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-gray-800 text-teal-500"
                      : "text-gray-300 hover:bg-gray-800 hover:text-teal-400",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      pathname === item.href ? "text-teal-500" : "text-gray-400 group-hover:text-teal-400",
                    )}
                  />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <div>
                      <Avatar>
                        <AvatarFallback className="bg-teal-800 text-teal-100">{(user?.name[0]).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">View details</p>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-stone-950 border-gray-800">
                <DropdownMenuLabel className="text-gray-300">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                {/* <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 hover:text-teal-400 focus:bg-gray-800 focus:text-teal-400">
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:bg-gray-800 hover:text-teal-400 focus:bg-gray-800 focus:text-teal-400">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem> */}
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem onClick={signOut} className="text-gray-300 hover:bg-gray-800 hover:text-teal-400 focus:bg-gray-800 focus:text-teal-400">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72 bg-stone-950 border-r border-gray-800">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center">
              <span className="text-xl font-semibold text-teal-500">PrepWise</span>
            </Link>
            {/* <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5 text-gray-400" />
            </Button> */}
          </div>
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="px-4 mb-6">
              <Button asChild className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                <Link href="/interview">
                  <Plus className="mr-2 h-4 w-4" /> Start New Interview
                </Link>
              </Button>
            </div>
            <nav className="mt-2 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-gray-800 text-teal-500"
                      : "text-gray-300 hover:bg-gray-800 hover:text-teal-400",
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      pathname === item.href ? "text-teal-500" : "text-gray-400 group-hover:text-teal-400",
                    )}
                  />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
            <button className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-teal-800 text-teal-100">JD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">View profile</p>
                </div>
              </div>
            </button>
          </div>
        </SheetContent>

        {/* Main Content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-stone-950 border-b border-gray-800 md:hidden">
            <div className="flex-1 flex justify-between mx-4 px-auto">
              <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="px-4 text-gray-400 focus:outline-none">
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <Bell className="h-5 w-5" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-teal-800 text-teal-100">JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </Sheet>
    </div>
  )
}

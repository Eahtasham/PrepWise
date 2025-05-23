import Link from "next/link"
import { Calendar, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InterviewCard from "@/components/InterviewCard"
import { ScheduleInterviewModal } from "./schedule-interview-modal"

interface ScheduledInterviewsProps {
  user: any
  interviews: any[] | null
}

export function ScheduledInterviews({ user, interviews }: ScheduledInterviewsProps) {
  const hasInterviews = interviews && interviews.length > 0

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Scheduled Interviews</h1>
          <p className="text-gray-400 mt-1">Manage your upcoming interview practice sessions</p>
        </div>
        <div className="mt-4 md:mt-0">
          <ScheduleInterviewModal user={user} />
        </div>
      </div>

      <Card className="dark-gradient border-teal-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search interviews..."
                className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-teal-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px] bg-gray-800 border-gray-700 text-white focus:ring-teal-500">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasInterviews ? (
            <div className="interviews-section flex flex-wrap gap-4 justify-center md:justify-start">
              {interviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={interview?.userId}
                  id={interview.id}
                  role={interview.role}
                  type={interview.type}
                  finalized={interview.finalized}
                  coverImage={interview.coverImage}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md border border-teal-500/30 text-gray-300 w-full">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                There are no scheduled interviews available.{" "}
                <Link href="/interview">
                  <button className="text-teal-500 hover:text-teal-400 hover:underline">Create one now</button>
                </Link>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

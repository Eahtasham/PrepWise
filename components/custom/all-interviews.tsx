import Link from "next/link"
import { Calendar, Download, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InterviewCard from "@/components/InterviewCard"
import { ScheduleInterviewModal } from "./schedule-interview-modal"

interface AllInterviewsProps {
  user: any
  interviews: any[] | null
}

export function AllInterviews({ user, interviews }: AllInterviewsProps) {
  const hasInterviews = interviews && interviews.length > 0
  const completedInterviews = interviews?.filter((interview) => interview.finalized === true) || []
  const scheduledInterviews = interviews?.filter((interview) => interview.finalized === false) || []

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">All Interviews</h1>
          <p className="text-gray-400 mt-1">View and manage all your interview practice sessions</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <ScheduleInterviewModal user={user} />
        </div>
      </div>

      <Card className="dark-gradient border-teal-800">
        <CardHeader className="pb-3">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <TabsList className="bg-gray-800 text-gray-400">
                <TabsTrigger value="all" className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500">
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="scheduled"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500"
                >
                  Scheduled
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
              <div className="flex flex-wrap items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px] bg-gray-800 border-gray-700 text-white focus:ring-teal-500">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="fullstack">Full Stack</SelectItem>
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
            <div className="relative w-full md:w-96 mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search interviews..."
                className="pl-8 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-teal-500"
              />
            </div>

            <TabsContent value="all">
              <div className="interviews-section flex flex-wrap gap-4 justify-center md:justify-start">
                {hasInterviews ? (
                  interviews?.map((interview) => (
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
                  ))
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
                      You haven't created any interviews yet.{" "}
                      <Link href="/interview">
                        <button className="text-teal-500 hover:text-teal-400 hover:underline">Create one now</button>
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scheduled">
              <div className="interviews-section flex flex-wrap gap-4 justify-center md:justify-start">
                {scheduledInterviews.length > 0 ? (
                  scheduledInterviews.map((interview) => (
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
                  ))
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
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="interviews-section flex flex-wrap gap-4 justify-center md:justify-start">
                {completedInterviews.length > 0 ? (
                  completedInterviews.map((interview) => (
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
                  ))
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
                    <span>You have not completed any interviews yet.</span>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  )
}

import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Clock, TrendingUp, BarChart2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import InterviewCard from "@/components/InterviewCard"

interface DashboardContentProps {
  user: any
  userInterviews: any[] | null
  latestInterviews: any[] | null
}

export default function DashboardContent({ user, userInterviews, latestInterviews }: DashboardContentProps) {
  const hasPastInterviews = userInterviews && userInterviews.length > 0
  const hasUpcomingInterviews = latestInterviews && latestInterviews.length > 0

  // Calculate stats
  const totalInterviews = userInterviews?.length || 0
  const completedInterviews = userInterviews?.filter((interview) => interview.finalized === true).length || 0
  const scheduledInterviews = latestInterviews?.length || 0

  // Calculate average score if there are completed interviews
  const completedWithFeedback =
    userInterviews?.filter((interview) => interview.finalized === true && interview.feedback?.totalScore) || []

  const averageScore =
    completedWithFeedback.length > 0
      ? Math.round(
          completedWithFeedback.reduce((acc, interview) => acc + (interview.feedback?.totalScore || 0), 0) /
            completedWithFeedback.length,
        )
      : 0

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.name || "User"}. Track your interview progress.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild className="bg-teal-500 hover:bg-teal-600 text-white">
            <Link href="/interview">
              <CalendarDays className="mr-2 h-4 w-4" /> Start New Interview
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dark-gradient border-teal-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Interviews</CardTitle>
            <Users className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalInterviews}</div>
            <p className="text-xs text-teal-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Your interview journey
            </p>
          </CardContent>
        </Card>
        <Card className="dark-gradient border-teal-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Scheduled</CardTitle>
            <CalendarDays className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{scheduledInterviews}</div>
            <p className="text-xs text-teal-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Upcoming practice sessions
            </p>
          </CardContent>
        </Card>
        <Card className="dark-gradient border-teal-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completed</CardTitle>
            <BarChart2 className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedInterviews}</div>
            <p className="text-xs text-teal-500 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Interviews with feedback
            </p>
          </CardContent>
        </Card>
        <Card className="dark-gradient border-teal-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg. Score</CardTitle>
            <Clock className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{averageScore}/100</div>
            <p className="text-xs text-gray-400 mt-1">Across all interviews</p>
          </CardContent>
        </Card>
      </div>

      
      {/* Performance Section */}
      {completedInterviews > 0 && (
        <Card className="dark-gradient border-teal-800">
          <CardHeader>
            <CardTitle>Interview Performance</CardTitle>
            <CardDescription className="text-gray-400">Your progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Technical Skills</span>
                  <span className="text-sm font-medium text-gray-300">75%</span>
                </div>
                <Progress value={75} className="h-2 bg-gray-700"  />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Communication</span>
                  <span className="text-sm font-medium text-gray-300">82%</span>
                </div>
                <Progress value={82} className="h-2 bg-gray-700"  />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Problem Solving</span>
                  <span className="text-sm font-medium text-gray-300">68%</span>
                </div>
                <Progress value={68} className="h-2 bg-gray-700" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Overall Performance</span>
                  <span className="text-sm font-medium text-gray-300">{averageScore}%</span>
                </div>
                <Progress value={averageScore} className="h-2 bg-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Tabs */}
      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="bg-gray-800 text-gray-400">
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500">
            Scheduled Interviews
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500">
            Completed Interviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="mt-4">
          <Card className="dark-gradient border-teal-800">
            <CardHeader>
              <CardTitle>Your Scheduled Interviews</CardTitle>
              <CardDescription className="text-gray-400">Upcoming interview practice sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="interviews-section flex flex-wrap gap-4 justify-center md:justify-start">
                {hasUpcomingInterviews ? (
                  latestInterviews?.map((interview) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <Card className="dark-gradient border-teal-800">
            <CardHeader>
              <CardTitle>Your Completed Interviews</CardTitle>
              <CardDescription className="text-gray-400">Review your past interviews and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="interviews-section flex flex-wrap gap-4 justify-center md:justify-start">
                {hasPastInterviews ? (
                  userInterviews
                    ?.filter((interview) => interview.finalized === true)
                    .map((interview) => (
                      <InterviewCard
                        key={interview.id}
                        userId={interview?.userId}
                        id={interview.id}
                        role={interview.role}
                        type={interview.type}
                        finalized={interview.finalized}
                        techstack={interview.techstack}
                        coverImage={interview.coverImage}
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
                    <span>You have not taken any interview yet.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


    </div>
  )
}

import Link from "next/link"
import { CalendarDays, Clock, TrendingUp, BarChart2, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import InterviewCard from "@/components/InterviewCard"
import { ScheduleInterviewModal } from "./schedule-interview-modal"

interface DashboardContentProps {
  user: any
  userInterviews: any[] | null
  latestInterviews: any[] | null
  feedbacks: any[] | null
}


interface PerformanceMetrics {
  averageScore: number
  technicalSkills: number
  communication: number
  problemSolving: number
}

// Helper function to calculate performance metrics
function calculatePerformanceData(feedbackData: Feedback[]): PerformanceMetrics {
  if (feedbackData.length === 0) {
    return {
      averageScore: 0,
      technicalSkills: 0,
      communication: 0,
      problemSolving: 0
    }
  }

  // Calculate averages from all feedback
  const totalScore = feedbackData.reduce((sum, feedback) => sum + feedback.totalScore, 0)
  const averageScore = Math.round(totalScore / feedbackData.length)

const technicalScores = feedbackData
    .map(f => {
      const categoryScore = f.categoryScores.find(cat => cat.name === "Technical Knowledge")
      return categoryScore ? categoryScore.score : 0
    })
    .filter(score => score > 0)

  const communicationScores = feedbackData
    .map(f => {
      const categoryScore = f.categoryScores.find(cat => cat.name === "Communication Skills")
      return categoryScore ? categoryScore.score : 0
    })
    .filter(score => score > 0)

  const problemSolvingScores = feedbackData
    .map(f => {
      const categoryScore = f.categoryScores.find(cat => cat.name === "Problem Solving")
      return categoryScore ? categoryScore.score : 0
    })
    .filter(score => score > 0)

  const technicalSkills = technicalScores.length > 0 
    ? Math.round(technicalScores.reduce((sum, score) => sum + score, 0) / technicalScores.length) 
    : 0

  const communication = communicationScores.length > 0
    ? Math.round(communicationScores.reduce((sum, score) => sum + score, 0) / communicationScores.length)
    : 0

  const problemSolving = problemSolvingScores.length > 0
    ? Math.round(problemSolvingScores.reduce((sum, score) => sum + score, 0) / problemSolvingScores.length)
    : 0

  return {
    averageScore,
    technicalSkills,
    communication,
    problemSolving
  }
}

export default function DashboardContent({ user, userInterviews, latestInterviews, feedbacks }: DashboardContentProps) {
  const feedbackData = feedbacks as Feedback[] || []
  const performanceData = calculatePerformanceData(feedbackData)

  const hasPastInterviews = userInterviews && userInterviews.length > 0
  const hasUpcomingInterviews = latestInterviews && latestInterviews.length > 0

  // Calculate basic stats
  const totalInterviews = userInterviews?.length || 0
  const completedInterviews = userInterviews?.filter((interview) => interview.finalized === true).length || 0
  const scheduledInterviews = latestInterviews?.length || 0


  // Pie chart data for visualization
const pieChartData = [
  { name: 'Technical Skills', value: performanceData.technicalSkills, color: '#3B82F6' }, // Blue
  { name: 'Communication', value: performanceData.communication, color: '#10B981' }, // Emerald
  { name: 'Problem Solving', value: performanceData.problemSolving, color: '#F59E0B' } // Amber
]

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, <span className="text-teal-500 font-semibold">{user?.name || "User"}</span> . Track your interview progress.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <ScheduleInterviewModal user={user} />
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
            <div className="text-2xl font-bold text-white">{performanceData.averageScore}/100</div>
            <p className="text-xs text-gray-400 mt-1">Across {feedbackData.length} completed interviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Section */}
      {feedbackData.length > 0 && (
        <Card className="dark-gradient border-teal-800">
          <CardHeader>
            <CardTitle>Interview Performance</CardTitle>
            <CardDescription className="text-gray-400">
              Your average performance across {feedbackData.length} interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress Bars Section */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Technical Skills</span>
                    <span className="text-sm font-medium text-gray-300">{performanceData.technicalSkills}%</span>
                  </div>
                  <Progress value={performanceData.technicalSkills} className="h-3 bg-gray-700" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Communication</span>
                    <span className="text-sm font-medium text-gray-300">{performanceData.communication}%</span>
                  </div>
                  <Progress value={performanceData.communication} className="h-3 bg-gray-700" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Problem Solving</span>
                    <span className="text-sm font-medium text-gray-300">{performanceData.problemSolving}%</span>
                  </div>
                  <Progress value={performanceData.problemSolving} className="h-3 bg-gray-700" />
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Overall Performance</span>
                    <span className="text-sm font-medium text-gray-300">{performanceData.averageScore}%</span>
                  </div>
                  <Progress value={performanceData.averageScore} className="h-3 bg-gray-700" />
                </div>
              </div>

              {/* Pie Chart Section */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-52 h-52 mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="6"
                    />
                    
                    {/* Dynamic pie chart segments */}
                    {(() => {
                      let cumulativePercentage = 0
                      const totalValue = pieChartData.reduce((sum, item) => sum + item.value, 0)
                      
                      return pieChartData.map((data, index) => {
                        if (data.value === 0) return null
                        
                        const percentage = data.value / totalValue
                        const strokeDasharray = `${percentage * 534.07} 534.07` // 2 * π * 85 ≈ 534.07
                        const strokeDashoffset = -cumulativePercentage * 534.07
                        cumulativePercentage += percentage
                        
                        return (
                          <circle
                            key={index}
                            cx="100"
                            cy="100"
                            r="85"
                            fill="none"
                            stroke={data.color}
                            strokeWidth="20"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-700 ease-in-out"
                          />
                        )
                      })
                    })()}
                    
                    {/* Center score */}
                    <text
                      x="100"
                      y="95"
                      textAnchor="middle"
                      className="fill-white text-2xl font-bold"
                      transform="rotate(90 100 100)"
                    >
                      {performanceData.averageScore}
                    </text>
                    <text
                      x="100"
                      y="115"
                      textAnchor="middle"
                      className="fill-gray-400 text-sm"
                      transform="rotate(90 100 100)"
                    >
                      Overall
                    </text>
                  </svg>
                </div>
                
                {/* Legend */}
                <div className="space-y-2">
                  {pieChartData.map((data, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <span className="text-gray-300 min-w-0 flex-1">{data.name}</span>
                      <span className="text-gray-400 font-medium">{data.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


      {/* No feedback available state */}
      {completedInterviews > 0 && feedbackData.length === 0 && (
        <Card className="dark-gradient border-teal-800">
          <CardHeader>
            <CardTitle>Interview Performance</CardTitle>
            <CardDescription className="text-gray-400">Performance analytics will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <BarChart2 className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No feedback data available yet</p>
                <p className="text-gray-500 text-sm mt-1">Complete more interviews to see your performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Tabs */}
      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="bg-gray-800 text-gray-400">
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500">
            Scheduled Interviews ({scheduledInterviews})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-gray-900 data-[state=active]:text-teal-500">
            Completed Interviews ({completedInterviews})
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
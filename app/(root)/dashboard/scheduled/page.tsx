import { getCurrentUser } from "@/lib/actions/auth.action"
import { getLatestInterviews } from "@/lib/actions/general.action"
import { ScheduledInterviews } from "@/components/custom/scheduled-interviews"
import { redirect } from "next/navigation"

export default async function ScheduledPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const latestInterviews = await getLatestInterviews({ userId: user?.id! })

  return <ScheduledInterviews user={user} interviews={latestInterviews} />
}

import { getCurrentUser } from "@/lib/actions/auth.action"
import { getInterviewsByUserId } from "@/lib/actions/general.action"
import { AllInterviews } from "@/components/custom/all-interviews"
import { redirect } from "next/navigation"

export default async function AllInterviewsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const interviews = await getInterviewsByUserId(user?.id!)

  return <AllInterviews user={user} interviews={interviews} />
}

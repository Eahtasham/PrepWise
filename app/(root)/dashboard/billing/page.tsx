import { getCurrentUser } from "@/lib/actions/auth.action"
import { BillingContent } from "@/components/custom/billing-content"
import { redirect } from "next/navigation"

export default async function BillingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <BillingContent user={user} />
}

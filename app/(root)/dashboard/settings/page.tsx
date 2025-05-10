import { getCurrentUser } from "@/lib/actions/auth.action"
import { SettingsContent } from "@/components/custom/settings-content"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <SettingsContent user={user} />
}

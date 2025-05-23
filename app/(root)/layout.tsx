import { DashboardShell } from '@/components/custom/dashboard-shell'
import { getCurrentUser, isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect ('/sign-in');
  const user = await getCurrentUser();
  return(
    <div className=''>
      <nav>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={45} height={45} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
      </nav>
      <DashboardShell user={user}>{children}</DashboardShell>
      
    </div>
  )
}

export default RootLayout
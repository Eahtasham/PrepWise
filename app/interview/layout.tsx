import { DashboardShell } from '@/components/custom/dashboard-shell'
import { isAuthenticated } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect ('/sign-in');
  return(
    <div className='flex mx-auto max-w-[88rem] flex-col gap-12 my-12 px-2 max-sm:px-4 max-sm:my-8'>
      <nav>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={45} height={45} />
          <h2 className="text-primary-100">PrepWise</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default RootLayout
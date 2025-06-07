import { getCurrentUser } from "@/lib/actions/auth.action"
import { getFeedbackByUserId, getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action"
import DashboardContent from "@/components/custom/dashboard-content"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const [userInterviews, latestInterviews, feedbacks] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
     getFeedbackByUserId({ userId: user.id })
  ])

  return <DashboardContent user={user} userInterviews={userInterviews} latestInterviews={latestInterviews} feedbacks={feedbacks} />
}

// import Link from "next/link";
// import Image from "next/image";

// import { Button } from "@/components/ui/button";
// import InterviewCard from "@/components/InterviewCard";
// import { dummyInterviews } from "@/constants";
// import { getCurrentUser } from "@/lib/actions/auth.action";
// import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";


// async function Home() {
//   const user = await getCurrentUser();


//   if (!user) {
//     return;
//   }
//   const [userInterviews, latestInterviews] = await Promise.all([
//     await getInterviewsByUserId(user?.id!),
//     await getLatestInterviews({ userId: user?.id! })
//   ])

//   const hasPastInterviews = userInterviews!?.length > 0;
//   const hasUpcomingInterviews = latestInterviews!?.length > 0;
//   return (
//     <>
//       <section className="card-cta">
//         <div className="flex flex-col gap-6 max-w-lg">
//           <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
//           <p className="text-lg">
//             Practice real interview questions & get instant feedback
//           </p>

//           <Button asChild className="btn-primary max-sm:w-full">
//             <Link href="/interview">Start an Interview</Link>
//           </Button>
//         </div>

//         <Image
//           src="/robot.png"
//           alt="robo-dude"
//           width={400}
//           height={400}
//           className="max-sm:hidden"
//         />
//       </section>
//       <section className="flex flex-col gap-6 mt-8">
//         <h2>Your Scheduled Interview</h2>

//         <div className="interviews-section">
//           {hasUpcomingInterviews ? (
//             latestInterviews?.map((interview) => (
//               <InterviewCard
//                 key={interview.id}
//                 userId={interview?.userId}
//                 id={interview.id}
//                 role={interview.role}
//                 type={interview.type}
//                 finalized={interview.finalized}
//                 coverImage={interview.coverImage}
//                 techstack={interview.techstack}
//                 createdAt={interview.createdAt}
//               />
//             )
//             )) : (
//             <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md border border-teal-500/30 text-gray-300">
//               <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>There are no scheduled interviews available. <Link href="/interview"><button className="text-teal-500 hover:text-teal-400 hover:underline">Create one now</button></Link></span>
//             </div>
//           )}
//         </div>
//       </section>
//       <section className="flex flex-col gap-6 mt-8">
//         <h2>Your Completed Interviews</h2>

//         <div className="interviews-section">
//           {hasPastInterviews ? (
//             userInterviews
//               ?.filter(interview => interview.finalized === true) // Filter only finalized interviews
//               .map((interview) => (
//                 <InterviewCard
//                   key={interview.id}
//                   userId={interview?.userId}
//                   id={interview.id}
//                   role={interview.role}
//                   type={interview.type}
//                   finalized={interview.finalized}
//                   techstack={interview.techstack}
//                   coverImage={interview.coverImage}
//                   createdAt={interview.createdAt}
//                 />
//               ))
//           ) : (
//             <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-md border border-teal-500/30 text-gray-300">
//               <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>YOu have not taken any interview yet.</span>
//             </div>
//           )}
//         </div>
//       </section>

//     </>
//   );
// }

// export default Home;
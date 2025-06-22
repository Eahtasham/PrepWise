import Agent from '@/components/Agent';
import DisplayTechIcons from '@/components/DisplayTechIcons';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { canRetakeInterview, getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
import { getRandomInterviewCover } from '@/lib/utils';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async ({params}:RouteParams) => {
    const {id} = await params;
    const interview = await getInterviewById(id);
    if(!interview) redirect("/");
    const user = await getCurrentUser();
    if (!user) redirect("/");
  
    const feedback = await getFeedbackByInterviewId({
      interviewId: id,
      userId: user?.id!,
    });

    const retakeStatus = await canRetakeInterview(id, user.id);

    // If interview is finalized and user can't retake, show completed state
    if (!retakeStatus.canRetake) {
      return (
        <>
          <div className="flex flex-row gap-4 justify-between">
            <div className="flex flex-row gap-4 items-center max-sm:flex-col">
              <div className="flex flex-row gap-4 items-center">
                <Image
                  src={getRandomInterviewCover()}
                  alt="cover-image"
                  width={40}
                  height={40}
                  className="rounded-full object-cover size-[40px]"
                />
                <h3 className="capitalize">{interview.role} Interview</h3>
              </div>

              <DisplayTechIcons techStack={interview.techstack} />
            </div>

            <div className="flex gap-2">
              <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
                {interview.type}
              </p>
              <p className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg h-fit">
                Completed
              </p>
            </div>
          </div>

          <div className="bg-dark-200 p-6 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Interview Completed</h4>
            <p className="text-gray-400 mb-4">
              You have used all available attempts for this interview.
            </p>
            {feedback && (
              <a 
                href={`/feedback/${feedback.id}`} 
                className="bg-primary px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
              >
                View Feedback
              </a>
            )}
          </div>
        </>
      );
    }

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name!}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        codingQuestion = {interview.codingQuestion}
        feedbackId={feedback?.id}
      />
    </>
  )
}

export default page
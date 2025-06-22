import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import { cn, getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";


const InterviewCard = async ({
    id,
    userId,
    role,
    type,
    coverImage,
    attempts,
    finalized,
    techstack,
    createdAt,
}: InterviewCardProps) => {
    const feedback = userId && id ? await getFeedbackByInterviewId({ interviewId: id, userId }) : null;
    console.log("Attempts Left:", attempts);

    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
    const badgeColor =
        {
            Behavioral: "bg-light-400",
            Mixed: "bg-light-600",
            Technical: "bg-light-800",
        }[normalizedType] || "bg-light-600";
    const formattedDate = dayjs(
        feedback?.createdAt || createdAt || Date.now()
    ).format("MMM D, YYYY");
    // console.log(coverImage);
    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
                <div>
                    {/* Type Badge */}
                    <div
                        className={cn(
                            "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
                            badgeColor
                        )}
                    >
                        <p className="badge-text ">{normalizedType}</p>
                    </div>

                    {/* Cover Image */}
                    <Image
                        src={coverImage || getRandomInterviewCover()}
                        alt="cover-image"
                        width={90}
                        height={90}
                        className="rounded-full object-fit size-[90px]"
                    />

                    {/* Interview Role */}
                    <h3 className="mt-5 capitalize">{role} Interview</h3>

                    {/* Date & Score */}
                    <div className="flex flex-row gap-5 mt-3">
                        <div className="flex flex-row gap-2">
                            <Image
                                src="/calendar.svg"
                                width={22}
                                height={22}
                                alt="calendar"
                            />
                            <p>{formattedDate}</p>
                        </div>

                        <div className="flex flex-row gap-2 items-center">
                            <Image src="/star.svg" width={22} height={22} alt="star" />
                            <p>{feedback?.totalScore || "---"}/100</p>
                        </div>
                    </div>
                    <div>
                        <p className={`text-sm mt-2 flex items-center gap-1 ${attempts === 0 ? 'text-red-500' :
                                attempts === 1 ? 'text-yellow-500' :
                                    'text-gray-500'
                            }`}>
                            {attempts === 0 && <span>⚠️</span>}
                            {attempts === 1 && <span>⚡</span>}
                            {(attempts ?? 0) > 1 && <span>✅</span>}

                            {attempts ?? 0
                                ? `${attempts ?? 0} Attempt${(attempts ?? 0) > 1 ? 's' : ''} Left`
                                : attempts === 0
                                    ? "No attempts remaining"
                                    : "✅ 2 Attempts Left"
                            }
                        </p>
                    </div>

                    {/* Feedback or Placeholder Text */}
                    <p className="line-clamp-2 mt-5">
                        {feedback?.finalAssessment ||
                            "You haven't taken this interview yet. Take it now to improve your skills."}
                    </p>
                </div>
                <DisplayTechIcons techStack={techstack} />
                <div className="flex flex-row justify-end gap-x-2">

                    {feedback && <Button className="w-fit !rounded-full !font-bold px-5 cursor-pointer min-h-10" variant="outline">
                        <Link
                            href={
                                feedback
                                    ? `/interview/${id}`
                                    : `/interview/${id}`
                            }
                        >
                            {feedback ? "Retake Interview" : "View Interview"}
                        </Link>
                    </Button>
                    }
                    {<Button className="justify-end btn-primary">
                        <Link
                            href={
                                feedback
                                    ? `/interview/${id}/feedback`
                                    : `/interview/${id}`
                            }
                        >
                            {feedback ? "Check Feedback" : "Take Interview"}
                        </Link>
                    </Button>
                    }
                </div>
            </div>
        </div>
    );
};

export default InterviewCard;
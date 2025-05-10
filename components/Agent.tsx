"use client"
import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Camera, CameraOff, Info, Video } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
}

const Agent = ({ userName, userId, type, interviewId, feedbackId, questions }: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    const [webcamActive, setWebcamActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const webcamRef = useRef<Webcam>(null);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === "final") {
                const newMessage = { role: message.role, content: message.transcript };
                setMessages((prev: any) => [...prev, newMessage]);
            }
        }

        const onSpeachStart = () => setIsSpeaking(true);
        const onSpeachEnd = () => setIsSpeaking(false);
        const onError = () => console.log("Error in call", Error);

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeachStart);
        vapi.on("speech-end", onSpeachEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeachStart);
            vapi.off("speech-end", onSpeachEnd);
            vapi.off("error", onError);
        }
    }, [])

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log("Generating feedback...");
        setIsLoading(true);


        const { success, feedbackId: id } = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
            feedbackId,
        });
        if (success && id) {
            router.push(`/interview/${interviewId}/feedback`)
        } else {
            console.log("Error generating feedback");
            setIsLoading(false);
            router.push("/dashboard");
        }
    }

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            // Stop webcam when call ends
            setWebcamActive(false);

            if (type === "generate") {
                router.push("/dashboard");
            } else {
                handleGenerateFeedback(messages);
            }
        }
    }, [messages, callStatus, type, userId]);

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        if (type === "generate") {
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    username: userName,
                    userid: userId,
                },
            });
        } else {
            let formattedQuestions = "";
            if (questions) {
                formattedQuestions = questions
                    .map((questions) => `-${questions}`)
                    .join("\n");
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions
                }
            })
        }
    }

    const handleDisconnect = async () => {
        setIsLoading(true);
        setCallStatus(CallStatus.FINISHED);
        setWebcamActive(false);
        vapi.stop();
    }

    const toggleWebcam = () => {
        setWebcamActive(prev => !prev);
    }

    const latestMessage = messages[messages.length - 1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

    // Webcam video constraints
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <>
            <div className="call-view">
                {/* AI Interviewer Card */}
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image
                            src="/ai-avatar.png"
                            alt="profile-image"
                            width={65}
                            height={54}
                            className="object-cover"
                        />
                        {isSpeaking && <span className="animate-speak bg-teal-500" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>

                {/* User Profile Card */}
                <div className="card-border relative">
                    <div className="card-content">
                        {webcamActive ? (
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                videoConstraints={videoConstraints}
                                screenshotFormat="image/jpeg"
                                mirrored={true}
                                className="rounded-md object-cover"
                            />
                        ) : (
                            <Image
                                src="/user-avatar.png"
                                alt="profile-image"
                                width={539}
                                height={539}
                                className="rounded-full object-cover size-[120px]"
                            />
                        )}
                        <h3>{userName}</h3>
                        {/* Webcam Toggle Button */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={toggleWebcam}
                                        className="absolute bottom-2 right-2 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                        aria-label={webcamActive ? "Turn off webcam" : "Turn on webcam"}
                                    >
                                        {webcamActive ? (
                                            <CameraOff className="text-teal-500 w-5 h-5" />
                                        ) : (
                                            <Camera className="text-teal-500 w-5 h-5" />
                                        )}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className='text-teal-500'> <span className='text-teal-800'>{webcamActive ? "Turn off webcam" : "Turn on webcam for more realism"}<br></br> </span> Your video is not recorded</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>

                </div>
            </div>

            <div className="w-full flex justify-center">
                {callStatus !== "ACTIVE" ? (
                    <button className="relative btn-call" onClick={handleCall}>
                        <span
                            className={cn(
                                "absolute animate-ping rounded-full opacity-75",
                                callStatus !== "CONNECTING" && "hidden"
                            )}
                        />

                        <span className="relative">
                            {isCallInactiveOrFinished ? "Call" : ". . ."}
                        </span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>

            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className='transcript'>
                        <p key={latestMessage} className={cn("transition-opacity duration-500 opacity-0", "animate-fadeIn opacity-100")}>
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}
            {isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="loader">
                        <div className="w-16 h-16 border-4 border-t-teal-500 border-r-transparent border-b-teal-500 border-l-transparent rounded-full animate-spin"></div>
                        <p className="text-teal-500 mt-4 font-medium">Creating Feedback...</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Agent
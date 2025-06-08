"use client"
import { interviewer } from "@/constants"
import { createFeedback } from "@/lib/actions/general.action"
import { cn } from "@/lib/utils"
import { vapi } from "@/lib/vapi.sdk"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Camera, CameraOff, Code } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import Webcam from "react-webcam"
import CodeEditor, { executeCode, LANGUAGES } from "./custom/code-editor"


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

export interface CodeQuestion {
    title: string;
    difficulty: string;
    description: string;
    examples: string[];
}

const Agent = ({ userName, userId, type, interviewId, feedbackId, questions, codingQuestion }: AgentProps) => {
    const router = useRouter()
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
    const [messages, setMessages] = useState<SavedMessage[]>([])
    const [webcamActive, setWebcamActive] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const webcamRef = useRef<Webcam>(null)
    const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false)
    const [codeEditorContent, setCodeEditorContent] = useState<{
        language: keyof typeof LANGUAGES;
        code: string;
        output?: string;
    }>({
        language: 'javascript',
        code: LANGUAGES.javascript.template,
        output: ''
    });

  useEffect(() => {
    messages.forEach((message) => {
      // Listen for transcript messages
      if (message.role === 'assistant' && typeof message.content === 'string') {
        // Check for coding section trigger
        if (message.content.includes('coding section start') || message.content.includes('coding section')) {
          setIsCodeEditorOpen(true);
        }
      }
    });
  }, [messages]);


    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE)
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED)

        const onMessage = (message: Message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = { role: message.role, content: message.transcript }
                setMessages((prev: any) => [...prev, newMessage])
            }
        }

        const onSpeachStart = () => setIsSpeaking(true)
        const onSpeachEnd = () => setIsSpeaking(false)
        const onError = () => console.log("Error in call", Error)

        vapi.on("call-start", onCallStart)
        vapi.on("call-end", onCallEnd)
        vapi.on("message", onMessage)
        vapi.on("speech-start", onSpeachStart)
        vapi.on("speech-end", onSpeachEnd)
        vapi.on("error", onError)

        return () => {
            vapi.off("call-start", onCallStart)
            vapi.off("call-end", onCallEnd)
            vapi.off("message", onMessage)
            vapi.off("speech-start", onSpeachStart)
            vapi.off("speech-end", onSpeachEnd)
            vapi.off("error", onError)
        }
    }, [])

    const handleGenerateFeedback = async (messages: SavedMessage[], codeData?: {
        language: keyof typeof LANGUAGES;
        codingQuestion: CodeQuestion;
        code: string;
        output: string;
    }) => {
        console.log("Generating feedback...")
        setIsLoading(true)

        const { success, feedbackId: id } = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
            feedbackId,
            codeData,
        })
        if (success && id) {
            router.push(`/interview/${interviewId}/feedback`)
        } else {
            console.log("Error generating feedback")
            setIsLoading(false)
            router.push("/dashboard")
        }
    }
    // Update the executeAndGenerateFeedback function
    const executeAndGenerateFeedback = async () => {
        if (codeEditorContent.code) {
            try {
                console.log("Executing code...")
                const output = await executeCode(codeEditorContent.language, codeEditorContent.code);
                await handleGenerateFeedback(messages, {
                    language: codeEditorContent.language,
                    codingQuestion: codingQuestion || dummyCodeQuestion,
                    code: codeEditorContent.code,
                    output
                });
            } catch (error) {
                console.error("Error executing code:", error);
                await handleGenerateFeedback(messages, {
                    language: codeEditorContent.language,
                    codingQuestion: codingQuestion || dummyCodeQuestion,
                    code: codeEditorContent.code,
                    output: "Failed to execute code"
                });
            }
        } else {
            await handleGenerateFeedback(messages);
        }
    }

    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {
            // Stop webcam when call ends
            setWebcamActive(false)
            setIsCodeEditorOpen(false)

            if (type === "generate") {
                router.push("/dashboard")
            } else {
                executeAndGenerateFeedback()
            }
        }
    }, [messages, callStatus, type, userId])

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)

        if (type === "generate") {
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    username: userName,
                    userid: userId,
                },
            })
        } else {
            let formattedQuestions = ""
            if (questions) {
                formattedQuestions = questions.map((question: any) => `-${question}`).join("\n")
            }

            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions,
                    codingQuestion: codingQuestion?.description,
                },
            })
        }
    }

    const handleDisconnect = async () => {
        setIsLoading(true)
        setCallStatus(CallStatus.FINISHED)
        setWebcamActive(false)
        setIsCodeEditorOpen(false)
        vapi.stop()
    }

    const toggleWebcam = () => {
        setWebcamActive((prev) => !prev)
    }

    const toggleEditor = () => {
        setIsCodeEditorOpen((prev) => !prev)
    }

    const latestMessage = messages[messages.length - 1]?.content
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED

    // Webcam video constraints
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user",
    }

    const dummyCodeQuestion = {
        title: "Dummy Code Question",
        difficulty: "Easy",
        description: "This is a dummy code question for testing purposes.",
        examples: ["Input: None\nOutput: Hello, world!"],
    }

    return (
        <>
            <div className={cn("flex h-screen transition-all duration-500 w-full ease-in-out", isCodeEditorOpen ? "gap-4 p-4" : "")}>
                {/* Left Side - Interview Cards */}
                <div
                    className={cn(
                        "transition-all duration-500 ease-in-out flex flex-col h-full",
                        isCodeEditorOpen ? "w-1/3 h-full" : "w-full",
                    )}
                >
                    {/* Top Controls Bar - Only when code editor is open */}
                    {isCodeEditorOpen && (
                        <div className="flex justify-between items-center mb-4 px-4 py-2 bg-gray-900/50 rounded-lg backdrop-blur-sm">
                            <div className="flex gap-2">
                                {/* Call Controls */}
                                {callStatus !== "ACTIVE" ? (
                                    <button className="relative btn-call !text-sm !px-4 !py-2" onClick={handleCall}>
                                        <span
                                            className={cn(
                                                "absolute animate-ping rounded-full opacity-75",
                                                callStatus !== "CONNECTING" && "hidden",
                                            )}
                                        />
                                        <span className="relative">{isCallInactiveOrFinished ? "Call" : ". . ."}</span>
                                    </button>
                                ) : (
                                    <button className="btn-disconnect !text-sm !px-4 !py-2" onClick={handleDisconnect}>
                                        End
                                    </button>
                                )}
                            </div>

                            {/* Control Buttons */}
                            <div className="flex gap-2">
                                {/* Code Editor Toggle Button */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={toggleEditor}
                                                className="bg-teal-600 hover:bg-teal-700 p-2 rounded-full transition-colors"
                                                aria-label="Close code editor"
                                            >
                                                <Code className="text-white w-4 h-4" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-teal-500">Close code editor</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                {/* Webcam Toggle Button */}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={toggleWebcam}
                                                className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                                aria-label={webcamActive ? "Turn off webcam" : "Turn on webcam"}
                                            >
                                                {webcamActive ? (
                                                    <CameraOff className="text-teal-500 w-4 h-4" />
                                                ) : (
                                                    <Camera className="text-teal-500 w-4 h-4" />
                                                )}
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-teal-500">
                                                <span className="text-teal-800">
                                                    {webcamActive ? "Turn off webcam" : "Turn on webcam for more realism"}
                                                </span>
                                                <br />
                                                Your video is not recorded
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    )}

                    <div
                        className={cn(
                            "call-view transition-all duration-500 ease-in-out",
                            isCodeEditorOpen ? "flex-1 flex flex-col min-h-0 gap-4" : "",
                        )}
                    >
                        {/* AI Interviewer Card */}
                        <div
                            className={cn(
                                "card-interviewer transition-all duration-500 ease-in-out",
                                isCodeEditorOpen ? "flex-1 min-h-0 max-h-[45%]" : "",
                            )}
                        >
                            <div className="avatar">
                                <Image src="/ai-avatar.png" alt="profile-image" width={65} height={54} className="object-cover" />
                                {isSpeaking && <span className="animate-speak bg-teal-500" />}
                            </div>
                            <h3>AI Interviewer</h3>
                        </div>

                        {/* User Profile Card */}
                        <div
                            className={cn(
                                "card-border relative transition-all duration-500 ease-in-out overflow-hidden",
                                isCodeEditorOpen ? "flex-1 min-h-0 max-h-[45%]" : "",
                            )}
                        >
                            <div className="card-content overflow-hidden">
                                {webcamActive ? (
                                    <Webcam
                                        ref={webcamRef}
                                        audio={false}
                                        videoConstraints={videoConstraints}
                                        screenshotFormat="image/jpeg"
                                        mirrored={true}
                                        className="rounded-md object-cover w-full h-full"
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

                                {/* Control Buttons - Only when code editor is closed */}
                                {!isCodeEditorOpen && (
                                    <div className="absolute bottom-2 right-2 flex gap-2">
                                        {/* Code Editor Toggle Button */}
                                        { codingQuestion && <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={toggleEditor}
                                                        className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
                                                        aria-label="Open code editor"
                                                    >
                                                        <Code className="text-teal-500 w-5 h-5" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-teal-500">
                                                        <span className="text-teal-800">Open code editor</span>
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>}

                                        {/* Webcam Toggle Button */}
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        onClick={toggleWebcam}
                                                        className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
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
                                                    <p className="text-teal-500">
                                                        <span className="text-teal-800">
                                                            {webcamActive ? "Turn off webcam" : "Turn on webcam for more realism"}
                                                            <br />
                                                        </span>
                                                        Your video is not recorded
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Call Controls - Only when code editor is closed */}
                    {!isCodeEditorOpen && (
                        <div className="w-full flex justify-center mt-8">
                            {callStatus !== "ACTIVE" ? (
                                <button className="relative btn-call" onClick={handleCall}>
                                    <span
                                        className={cn(
                                            "absolute animate-ping rounded-full opacity-75",
                                            callStatus !== "CONNECTING" && "hidden",
                                        )}
                                    />
                                    <span className="relative">{isCallInactiveOrFinished ? "Call" : ". . ."}</span>
                                </button>
                            ) : (
                                <button className="btn-disconnect" onClick={handleDisconnect}>
                                    End
                                </button>
                            )}
                        </div>
                    )}

                    {/* Transcript - Bottom section when code editor is open, or regular position when closed */}
                    {messages.length > 0 && (
                        <div className={cn("transcript-border", isCodeEditorOpen ? "mt-4 max-h-[120px] overflow-y-auto" : "mt-4")}>
                            <div className="transcript">
                                <p
                                    key={latestMessage}
                                    className={cn("transition-opacity duration-500 opacity-0", "animate-fadeIn opacity-100")}
                                >
                                    {latestMessage}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side - Code Editor */}
                {isCodeEditorOpen && (
                    <div className="w-2/3 h-full transition-all duration-500 ease-in-out transform translate-x-0">
                        <div className="h-full bg-background rounded-lg border shadow-lg overflow-hidden">
                            <CodeEditor
                                isOpen={isCodeEditorOpen}
                                onClose={() => setIsCodeEditorOpen(false)}
                                isEmbedded={true}
                                question={codingQuestion || dummyCodeQuestion}
                                onCodeChange={(language, code, output) => {
                                    setCodeEditorContent(prev => ({
                                        ...prev,
                                        language,
                                        code,
                                        output: output || prev.output
                                    }));
                                }}
                                initialLanguage={codeEditorContent.language}
                                initialCode={codeEditorContent.code}
                                initialOutput={codeEditorContent.output}
                            />
                        </div>
                    </div>
                )}
            </div>

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
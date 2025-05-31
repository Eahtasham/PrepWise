"use client"

import React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ChevronDown, ChevronRight, Code, FileText, Terminal, X, Maximize2, Minimize2, Copy } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CodeEditorProps {
  isOpen: boolean
  onClose: () => void
  isEmbedded?: boolean
  question?: {
    title: string
    difficulty: string
    description: string
    examples: string[]
  }
}

export default function CodeEditor({ isOpen, onClose, question, isEmbedded = false }: CodeEditorProps) {
  const [questionHeight, setQuestionHeight] = useState(200)
  const [editorHeight, setEditorHeight] = useState(400)
  const [outputVisible, setOutputVisible] = useState(false)
  const [outputHeight, setOutputHeight] = useState(200)
  const [code, setCode] = useState(`function solution() {
  // Write your code here
  
}`)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const questionResizeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const editorResizeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const outputResizeRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const defaultQuestion = {
    title: "Two Sum",
    difficulty: "Easy" as const,
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    ],
  }

  const currentQuestion = question || defaultQuestion

  const handleResize = useCallback(
    (
      ref: React.RefObject<HTMLDivElement>,
      setter: (height: number) => void,
      minHeight = 100,
    ) => {
      const startResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        // Convert React synthetic event to native event for resizing logic
        const nativeEvent = e.nativeEvent
        const startY = nativeEvent.clientY
        const startHeight = ref.current?.offsetHeight || 0

        const doResize = (moveEvent: MouseEvent) => {
          const newHeight = Math.max(minHeight, startHeight + (moveEvent.clientY - startY))
          setter(newHeight)
        }

        const stopResize = () => {
          document.removeEventListener("mousemove", doResize)
          document.removeEventListener("mouseup", stopResize)
        }

        document.addEventListener("mousemove", doResize)
        document.addEventListener("mouseup", stopResize)
      }

      return startResize
    },
    [],
  )

  const runCode = () => {
    setIsRunning(true)
    setOutputVisible(true)

    // Simulate code execution
    setTimeout(() => {
      setOutput(`Running code...
      
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

✅ Test case 1 passed
✅ Test case 2 passed
❌ Test case 3 failed: Expected [1,2] but got [0,1]

Runtime: 64ms
Memory: 42.1MB`)
      setIsRunning(false)
    }, 1500)
  }

  const copyCode = () => {
    if (editorRef.current) {
      navigator.clipboard.writeText(editorRef.current.value)
    }
  }

  // Handle tab key in editor
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab" && document.activeElement === editorRef.current) {
        e.preventDefault()
        const start = editorRef.current!.selectionStart
        const end = editorRef.current!.selectionEnd
        const value = editorRef.current!.value

        editorRef.current!.value = value.substring(0, start) + "  " + value.substring(end)
        editorRef.current!.selectionStart = editorRef.current!.selectionEnd = start + 2
      }
    }

    document.addEventListener("keydown", handleTabKey)
    return () => document.removeEventListener("keydown", handleTabKey)
  }, [])

  if (!isOpen && !isEmbedded) return null

  // If embedded, render without modal wrapper
  if (isEmbedded) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b bg-background">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-500" />
            <h3 className="font-semibold">Coding Challenge</h3>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Question Section */}
          <div ref={questionResizeRef} className="border-b bg-muted/30" style={{ height: questionHeight }}>
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-teal-500" />
                <h3 className="font-semibold">Problem Statement</h3>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2",
                    currentQuestion.difficulty === "Easy" && "bg-green-500/10 text-green-500 border-green-500/20",
                    currentQuestion.difficulty === "Medium" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                    currentQuestion.difficulty === "Hard" && "bg-red-500/10 text-red-500 border-red-500/20",
                  )}
                >
                  {currentQuestion.difficulty}
                </Badge>
              </div>
              <div className="flex-1 overflow-auto text-sm">
                <h4 className="font-medium mb-2">{currentQuestion.title}</h4>
                <p className="text-muted-foreground mb-3">{currentQuestion.description}</p>
                {currentQuestion.examples.map((example, index) => (
                  <div key={index} className="bg-muted p-3 rounded text-xs mb-2">
                    <strong>Example {index + 1}:</strong>
                    <br />
                    {example.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="h-1 bg-border hover:bg-teal-500/50 cursor-row-resize"
              onMouseDown={handleResize(questionResizeRef, setQuestionHeight)}
            />
          </div>

          {/* Code Editor Section */}
          <div ref={editorResizeRef} className="border-b" style={{ height: editorHeight }}>
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-teal-500" />
                  <h3 className="font-semibold">Code Editor</h3>
                  <Badge variant="outline">JavaScript</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={copyCode} className="h-8">
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </Button>
                  <Button
                    onClick={runCode}
                    disabled={isRunning}
                    size="sm"
                    className="bg-teal-500 hover:bg-teal-600 h-8"
                  >
                    <Play className="w-3.5 h-3.5 mr-1" />
                    {isRunning ? "Running..." : "Run Code"}
                  </Button>
                </div>
              </div>
              <div className="flex-1 relative rounded border overflow-hidden">
                <div className="absolute inset-0 bg-[#1e1e1e] text-white font-mono p-0">
                  <div className="flex h-full">
                    {/* Line numbers */}
                    <div className="py-2 px-2 text-right select-none bg-[#252526] text-[#858585] min-w-[40px]">
                      {code.split("\n").map((_, i) => (
                        <div key={i} className="leading-6 text-xs">
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    {/* Editor */}
                    <textarea
                      ref={editorRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="flex-1 bg-transparent resize-none outline-none p-2 leading-6 text-sm font-mono"
                      spellCheck="false"
                      placeholder="Write your code here..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="h-1 bg-border hover:bg-teal-500/50 cursor-row-resize"
              onMouseDown={handleResize(editorResizeRef, setEditorHeight)}
            />
          </div>

          {/* Output Section */}
          <div className="flex-1 min-h-0">
            <div className="p-4 h-full flex flex-col">
              <Button
                variant="ghost"
                onClick={() => setOutputVisible(!outputVisible)}
                className="flex items-center gap-2 mb-3 justify-start p-0 h-auto"
              >
                {outputVisible ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <Terminal className="w-4 h-4 text-teal-500" />
                <h3 className="font-semibold">Output</h3>
                {output && (
                  <Badge variant="secondary" className="ml-2">
                    Results Available
                  </Badge>
                )}
              </Button>

              {outputVisible && (
                <div
                  ref={outputResizeRef}
                  className="flex-1 bg-[#1e1e1e] text-white rounded border border-[#333] p-3 overflow-auto"
                  style={{ minHeight: outputHeight }}
                >
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {output || "Click 'Run Code' to see output here..."}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original modal version (kept for backward compatibility)
  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={cn(
          "bg-background rounded-lg shadow-xl flex flex-col transition-all duration-300 ease-in-out",
          isFullscreen ? "w-full h-full rounded-none" : "w-[90%] h-[90%] max-w-7xl",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-500" />
            <h3 className="font-semibold">Coding Challenge</h3>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Main Content - Same as embedded version */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col border-r">
            {/* Question Section */}
            <div ref={questionResizeRef} className="border-b bg-muted/30" style={{ height: questionHeight }}>
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-teal-500" />
                  <h3 className="font-semibold">Problem Statement</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2",
                      currentQuestion.difficulty === "Easy" && "bg-green-500/10 text-green-500 border-green-500/20",
                      currentQuestion.difficulty === "Medium" &&
                        "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                      currentQuestion.difficulty === "Hard" && "bg-red-500/10 text-red-500 border-red-500/20",
                    )}
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
                <div className="flex-1 overflow-auto text-sm">
                  <h4 className="font-medium mb-2">{currentQuestion.title}</h4>
                  <p className="text-muted-foreground mb-3">{currentQuestion.description}</p>
                  {currentQuestion.examples.map((example, index) => (
                    <div key={index} className="bg-muted p-3 rounded text-xs mb-2">
                      <strong>Example {index + 1}:</strong>
                      <br />
                      {example.split("\n").map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="h-1 bg-border hover:bg-teal-500/50 cursor-row-resize"
                onMouseDown={handleResize(questionResizeRef, setQuestionHeight)}
              />
            </div>

            {/* Code Editor Section */}
            <div ref={editorResizeRef} className="border-b" style={{ height: editorHeight }}>
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-teal-500" />
                    <h3 className="font-semibold">Code Editor</h3>
                    <Badge variant="outline">JavaScript</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={copyCode} className="h-8">
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy
                    </Button>
                    <Button
                      onClick={runCode}
                      disabled={isRunning}
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-600 h-8"
                    >
                      <Play className="w-3.5 h-3.5 mr-1" />
                      {isRunning ? "Running..." : "Run Code"}
                    </Button>
                  </div>
                </div>
                <div className="flex-1 relative rounded border overflow-hidden">
                  <div className="absolute inset-0 bg-[#1e1e1e] text-white font-mono p-0">
                    <div className="flex h-full">
                      {/* Line numbers */}
                      <div className="py-2 px-2 text-right select-none bg-[#252526] text-[#858585] min-w-[40px]">
                        {code.split("\n").map((_, i) => (
                          <div key={i} className="leading-6 text-xs">
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      {/* Editor */}
                      <textarea
                        ref={editorRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 bg-transparent resize-none outline-none p-2 leading-6 text-sm font-mono"
                        spellCheck="false"
                        placeholder="Write your code here..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="h-1 bg-border hover:bg-teal-500/50 cursor-row-resize"
                onMouseDown={handleResize(editorResizeRef, setEditorHeight)}
              />
            </div>

            {/* Output Section */}
            <div className="flex-1 min-h-0">
              <div className="p-4 h-full flex flex-col">
                <Button
                  variant="ghost"
                  onClick={() => setOutputVisible(!outputVisible)}
                  className="flex items-center gap-2 mb-3 justify-start p-0 h-auto"
                >
                  {outputVisible ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <Terminal className="w-4 h-4 text-teal-500" />
                  <h3 className="font-semibold">Output</h3>
                  {output && (
                    <Badge variant="secondary" className="ml-2">
                      Results Available
                    </Badge>
                  )}
                </Button>

                {outputVisible && (
                  <div
                    ref={outputResizeRef}
                    className="flex-1 bg-[#1e1e1e] text-white rounded border border-[#333] p-3 overflow-auto"
                    style={{ minHeight: outputHeight }}
                  >
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {output || "Click 'Run Code' to see output here..."}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

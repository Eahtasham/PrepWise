"use client"

import React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ChevronDown, ChevronRight, Code, FileText, Terminal, X, Maximize2, Minimize2, Copy, GripHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from '@monaco-editor/react'

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

// Language configurations
const LANGUAGES = {
  javascript: {
    name: 'JavaScript',
    monaco: 'javascript',
    template: `function solution(nums, target) {
  // Write your solution here
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
  },
  python: {
    name: 'Python',
    monaco: 'python',
    template: `def solution(nums, target):
    """
    Write your solution here
    """
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_map:
            return [num_map[complement], i]
        
        num_map[num] = i
    
    return []`,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  },
  java: {
    name: 'Java',
    monaco: 'java',
    template: `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        HashMap<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            
            map.put(nums[i], i);
        }
        
        return new int[]{};
    }
}`,
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
  },
  cpp: {
    name: 'C++',
    monaco: 'cpp',
    template: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            
            map[nums[i]] = i;
        }
        
        return {};
    }
};`,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
  }
}

// Resizable Panel Component
const ResizablePanel = ({ 
  children, 
  height, 
  onResize, 
  minHeight = 100,
  showHandle = true,
  className = ""
}: {
  children: React.ReactNode
  height: number
  onResize: (height: number) => void
  minHeight?: number
  showHandle?: boolean
  className?: string
}) => {
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    
    const startY = e.clientY
    const startHeight = height

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = Math.max(minHeight, startHeight + (e.clientY - startY))
      onResize(newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [height, minHeight, onResize])

  return (
    <div className={className} style={{ height }}>
      {children}
      {showHandle && (
        <div 
          className={cn(
            "h-2 bg-border hover:bg-teal-500/50 cursor-row-resize flex items-center justify-center transition-colors group",
            isResizing && "bg-teal-500"
          )}
          onMouseDown={handleMouseDown}
        >
          <GripHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-teal-500 transition-colors" />
        </div>
      )}
    </div>
  )
}

export default function CodeEditor({ isOpen, onClose, question, isEmbedded = false }: CodeEditorProps) {
  const [questionHeight, setQuestionHeight] = useState(250)
  const [editorHeight, setEditorHeight] = useState(400)
  const [outputVisible, setOutputVisible] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof LANGUAGES>('javascript')
  const [code, setCode] = useState(LANGUAGES.javascript.template)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  // Handle language change
  const handleLanguageChange = (language: string) => {
    const lang = language as keyof typeof LANGUAGES
    setSelectedLanguage(lang)
    setCode(LANGUAGES[lang].template)
  }

  const runCode = () => {
    setIsRunning(true)
    setOutputVisible(true) // Automatically open output section

    // Simulate code execution with language-specific output
    setTimeout(() => {
      const langName = LANGUAGES[selectedLanguage].name
      setOutput(`🚀 Running your ${langName} solution...

Test Case 1:
Input: nums = [2,7,11,15], target = 9
Expected: [0,1]
Your Output: [0,1]
✅ PASSED

Test Case 2:
Input: nums = [3,2,4], target = 6
Expected: [1,2]
Your Output: [1,2]
✅ PASSED

Test Case 3:
Input: nums = [3,3], target = 6
Expected: [0,1]
Your Output: [0,1]
✅ PASSED

🎉 All test cases passed!

Runtime: ${Math.floor(Math.random() * 100) + 50}ms (Beats ${Math.floor(Math.random() * 30) + 70}% of ${langName} submissions)
Memory: ${(Math.random() * 20 + 40).toFixed(1)}MB (Beats ${Math.floor(Math.random() * 30) + 60}% of ${langName} submissions)

Time Complexity: O(n)
Space Complexity: O(n)`)
      setIsRunning(false)
    }, 2000)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const closeOutput = () => {
    setOutputVisible(false)
  }

  if (!isOpen && !isEmbedded) return null

  const renderContent = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Question Section */}
      <ResizablePanel
        height={questionHeight}
        onResize={setQuestionHeight}
        minHeight={150}
        className="border-b bg-muted/30"
      >
        <div className="p-4 h-full flex flex-col overflow-hidden">
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
          <div className="flex-1 overflow-auto text-sm space-y-3">
            <div>
              <h4 className="font-medium text-base mb-2">{currentQuestion.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{currentQuestion.description}</p>
            </div>
            <div className="space-y-2">
              {currentQuestion.examples.map((example, index) => (
                <div key={index} className="bg-muted p-3 rounded-md border">
                  <div className="font-medium text-xs text-teal-600 mb-1">Example {index + 1}:</div>
                  <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                    {example}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResizablePanel>

      {/* Code Editor Section - Only show when output is not visible */}
      {!outputVisible && (
        <ResizablePanel
          height={editorHeight}
          onResize={setEditorHeight}
          minHeight={200}
          className="border-b"
        >
          <div className="p-4 h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-teal-500" />
                <h3 className="font-semibold">Code Editor</h3>
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGES).map(([key, lang]) => (
                      <SelectItem key={key} value={key}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className={LANGUAGES[selectedLanguage].color}>
                  {LANGUAGES[selectedLanguage].name}
                </Badge>
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
                  className="bg-teal-500 hover:bg-teal-600 h-8 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 mr-1" />
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded border">
              <Editor
                height="100%"
                language={LANGUAGES[selectedLanguage].monaco}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  lineHeight: 24,
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                  fontLigatures: true,
                }}
              />
            </div>
          </div>
        </ResizablePanel>
      )}

      {/* Output Section - Only show when output is visible */}
      {outputVisible && (
        <ResizablePanel
          height={editorHeight}
          onResize={setEditorHeight}
          minHeight={200}
          className="border-b"
        >
          <div className="p-4 h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-teal-500" />
                <h3 className="font-semibold">Output</h3>
                {output && (
                  <Badge variant="secondary">
                    Results Available
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeOutput}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 bg-[#1e1e1e] text-white rounded border border-[#333] p-4 overflow-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                {output || "Click 'Run Code' to see output here..."}
              </pre>
            </div>
          </div>
        </ResizablePanel>
      )}
    </div>
  )

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

        {renderContent()}
      </div>
    )
  }

  // Modal version
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

        {renderContent()}
      </div>
    </div>
  )
}
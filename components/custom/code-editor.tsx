"use client"

import React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ChevronDown, ChevronRight, Code, FileText, Terminal, X, Maximize2, Minimize2, Copy, GripHorizontal, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Editor from '@monaco-editor/react'

// **MODIFIED**: Made question prop optional and added code persistence
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
  onCodeChange?: (language: keyof typeof LANGUAGES, code: string, output?: string) => void
  initialLanguage?: keyof typeof LANGUAGES
  initialCode?: string
  initialOutput?: string
}

// **MODIFIED**: Updated language configurations with minimal starting templates
export const LANGUAGES = {
  javascript: {
    name: 'JavaScript',
    monaco: 'javascript',
    pistonLang: 'javascript',
    pistonVersion: '18.15.0',
    template: `// Write your JavaScript code here
function main() {
    // Your code goes here
    console.log("Hello, World!");
}

main();`,
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    wrapCode: (code: string) => code
  },
  python: {
    name: 'Python',
    monaco: 'python',
    pistonLang: 'python',
    pistonVersion: '3.10.0',
    template: `# Write your Python code here
def main():
    # Your code goes here
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    wrapCode: (code: string) => code
  },
  java: {
    name: 'Java',
    monaco: 'java',
    pistonLang: 'java',
    pistonVersion: '15.0.2',
    template: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        // Your code goes here
        System.out.println("Hello, World!");
    }
}`,
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    wrapCode: (code: string) => code
  },
  cpp: {
    name: 'C++',
    monaco: 'cpp',
    pistonLang: 'c++',
    pistonVersion: '10.2.0',
    template: `// Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    // Your code goes here
    cout << "Hello, World!" << endl;
    return 0;
}`,
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    wrapCode: (code: string) => code
  }
}

// **MODIFIED**: Added interface for Piston API response
interface PistonExecutionResult {
  language: string
  version: string
  run: {
    stdout: string
    stderr: string
    code: number
    signal: string | null
    output: string
  }
  compile?: {
    stdout: string
    stderr: string
    code: number
    signal: string | null
    output: string
  }
}

// **MODIFIED**: Added function to execute code via Piston API
export const executeCode = async (language: keyof typeof LANGUAGES, code: string): Promise<string> => {
  const langConfig = LANGUAGES[language]
  console.log(`Executing code in ${langConfig.name}...`)
  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: langConfig.pistonLang,
        version: langConfig.pistonVersion,
        files: [{
          name: language === 'java' ? 'Solution.java' : 
                language === 'cpp' ? 'main.cpp' : 
                language === 'python' ? 'main.py' : 'main.js',
          content: langConfig.wrapCode(code)
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: PistonExecutionResult = await response.json()
    
    let output = `🚀 Executing ${langConfig.name} code...\n\n`
    
    // Handle compilation errors (for compiled languages)
    if (result.compile && result.compile.code !== 0) {
      output += `❌ COMPILATION ERROR:\n${result.compile.stderr || result.compile.stdout}\n`
      return output
    }
    
    // Handle runtime output
    if (result.run.code === 0) {
      output += `✅ EXECUTION SUCCESSFUL\n\n`
      output += `📤 OUTPUT:\n${result.run.stdout}\n`
      
      if (result.run.stderr) {
        output += `\n⚠️ STDERR:\n${result.run.stderr}\n`
      }
      
      output += `\n📊 EXIT CODE: ${result.run.code}\n`
      if (result.run.signal) {
        output += `📡 SIGNAL: ${result.run.signal}\n`
      }
    } else {
      output += `❌ RUNTIME ERROR (Exit Code: ${result.run.code})\n\n`
      if (result.run.stderr) {
        output += `ERROR OUTPUT:\n${result.run.stderr}\n`
      }
      if (result.run.stdout) {
        output += `\nSTDOUT:\n${result.run.stdout}\n`
      }
      if (result.run.signal) {
        output += `\nSIGNAL: ${result.run.signal}\n`
      }
    }
    
    return output
    
  } catch (error) {
    return `❌ EXECUTION FAILED\n\nError: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nThis might be due to:\n- Network connectivity issues\n- Piston API unavailability\n- Invalid code syntax\n- Unsupported language features`
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

export default function CodeEditor({ isOpen, onClose, question, isEmbedded = false, onCodeChange }: CodeEditorProps) {
  const [questionHeight, setQuestionHeight] = useState(250)
  const [editorHeight, setEditorHeight] = useState(400)
  const [outputVisible, setOutputVisible] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof LANGUAGES>('javascript')
  // **MODIFIED**: Persistent code storage for each language
  const [codeStorage, setCodeStorage] = useState<Record<keyof typeof LANGUAGES, string>>({
    javascript: LANGUAGES.javascript.template,
    python: LANGUAGES.python.template,
    java: LANGUAGES.java.template,
    cpp: LANGUAGES.cpp.template,
  })
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // **MODIFIED**: Updated default question to be more generic
  const defaultQuestion = {
    title: "Code Challenge",
    difficulty: "Medium" as const,
    description:
      "Write a program to solve the given problem. You can use any algorithm or data structure that you think is appropriate. Make sure to handle edge cases and write clean, readable code.",
    examples: [
      "Example will be provided based on the specific problem requirements.",
    ],
  }

  const currentQuestion = question || defaultQuestion

  // **MODIFIED**: Get current code from storage instead of using template
  const code = codeStorage[selectedLanguage]

  // **MODIFIED**: Handle language change with code persistence
  const handleLanguageChange = (language: string) => {
    const lang = language as keyof typeof LANGUAGES
    setSelectedLanguage(lang)
    // Code will be automatically loaded from codeStorage
  }

  // **MODIFIED**: Handle code changes with persistence
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    setCodeStorage(prev => ({
      ...prev,
      [selectedLanguage]: newCode
    }))
  }

  // **MODIFIED**: Updated runCode function to use real execution
// Add output to the onCodeChange callback in the interface
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
  onCodeChange?: (language: keyof typeof LANGUAGES, code: string, output?: string) => void
  initialLanguage?: keyof typeof LANGUAGES
  initialCode?: string
  initialOutput?: string
}

// Update the runCode function to call onCodeChange with output
const runCode = async () => {
  setIsRunning(true)
  setOutputVisible(true)
  setOutput("🔄 Connecting to execution environment...\n\nPlease wait while your code is being executed...")

  try {
    const result = await executeCode(selectedLanguage, code)
    setOutput(result)
    if (onCodeChange) {
      onCodeChange(selectedLanguage, code, result)
    }
  } catch (error) {
    const errorMessage = `❌ EXECUTION FAILED\n\nError: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nPlease check your code and try again.`
    setOutput(errorMessage)
    if (onCodeChange) {
      onCodeChange(selectedLanguage, code, errorMessage)
    }
  } finally {
    setIsRunning(false)
  }
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
                {/* **MODIFIED**: Added indicator for real execution */}
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Live Execution
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
                  {isRunning ? "Executing..." : "Run Code"}
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded border">
              <Editor
                height="100%"
                language={LANGUAGES[selectedLanguage].monaco}
                value={code}
                onChange={handleCodeChange}
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
                  suggestOnTriggerCharacters: false,
                  quickSuggestions: false,
                  parameterHints: { enabled: false },
                  wordBasedSuggestions: "off"
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
                    {isRunning ? "Executing..." : "Results Available"}
                  </Badge>
                )}
                {/* **MODIFIED**: Added live execution indicator */}
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                  Real Execution
                </Badge>
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
            {/* **MODIFIED**: Added live execution indicator in header */}
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Live Execution Enabled
            </Badge>
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
            {/* **MODIFIED**: Added live execution indicator in modal header */}
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Live Execution Enabled
            </Badge>
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
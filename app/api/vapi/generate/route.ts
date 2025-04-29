import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
const serviceBasedContext = `
Technical Interviews in Indian IT firms (TCS, Infosys, Wipro, etc.) focus on:
1. Core Topics:
   - DSA: Arrays, strings, sorting, recursion, BFS/DFS.
   - OOP: Java/C++ (inheritance, polymorphism), language differences.
   - DBMS/SQL: Joins, normalization, queries (e.g., "2nd highest salary").
   - OS/Networks: Processes, memory, TCP/IP, DNS.
   - Modern Tech: AI/ML basics, cloud (for digital roles).

2. Coding Tests: 
   - 1-3 problems (easy-medium) on arrays, strings, or stacks.

3. Behavioral/HR:
   - Intro: "Tell me about yourself", career goals.
   - Fit: Strengths/weaknesses, "Why this company?".
   - Logistics: Relocation/night shift willingness, what you do if you don't selected for this role? or selected for lower role?.
   - Teamwork: Past conflict resolution examples.

Key Insights:
- Technical: LeetCode-style coding, OS/DBMS fundamentals, language-specific details.
- Behavioral: Communication, culture fit, situational judgment.
- Preparation: Practice coding (DSA), rehearse HR questions, research company tech stack.
`;

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The context is: ${serviceBasedContext}
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Do not give questions which requre a code editor,text input or a whiteboard to solve. Important:
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: false,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
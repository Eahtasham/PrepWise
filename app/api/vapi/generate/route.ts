import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { CodeQuestion } from "@/components/Agent";


const companyContexts = {
  "tcs": `
Technical Interviews at TCS (Tata Consultancy Services) focus on:
1. Core Topics:
   - DSA: Arrays, strings, basic sorting algorithms, recursion patterns.
   - Java/C++: Strong emphasis on OOP concepts, collections framework, exception handling.
   - DBMS/SQL: Complex joins, stored procedures, database optimization, PL/SQL basics.
   - Web Technologies: HTML, CSS, JavaScript, REST APIs, Spring Boot fundamentals.
   - Cloud & Digital: AWS/Azure basics, microservices architecture, DevOps concepts.

2. Coding Assessment:
   - 2-3 coding problems focusing on logical thinking and problem-solving.
   - Emphasis on clean, optimized code with proper documentation.

3. Behavioral/HR:
   - TCS values and cultural fit assessment.
   - Willingness to work in different domains and adapt to client requirements.
   - Communication skills for client interaction scenarios.
   - Questions about handling pressure and meeting deadlines.

TCS-Specific Insights:
- Strong focus on client-centric approach and adaptability.
- Emphasis on continuous learning and upskilling.
- Questions about working in agile methodologies and team collaboration.
`,

  "infosys": `
Technical Interviews at Infosys focus on:
1. Core Topics:
   - Programming: Strong Java/Python fundamentals, design patterns.
   - DSA: Problem-solving with arrays, linked lists, trees, and graphs.
   - Database: Advanced SQL queries, database design, normalization concepts.
   - System Design: Basic system architecture, scalability concepts.
   - Emerging Tech: AI/ML basics, automation tools, digital transformation.

2. Technical Assessment:
   - 2-4 coding challenges with focus on algorithmic thinking.
   - System design discussions for senior roles.

3. Behavioral/HR:
   - Innovation mindset and learning agility.
   - Leadership potential and mentoring capabilities.
   - Client engagement and stakeholder management.
   - Infosys values alignment and cultural fit.

Infosys-Specific Insights:
- Strong emphasis on innovation and digital transformation.
- Focus on automation and next-generation technologies.
- Questions about contributing to knowledge sharing and community building.
`,

  "wipro": `
Technical Interviews at Wipro focus on:
1. Core Topics:
   - Programming: Multi-language proficiency (Java, .NET, Python).
   - DSA: Comprehensive problem-solving across data structures.
   - Enterprise Technologies: Spring, Hibernate, microservices architecture.
   - Database: Complex SQL scenarios, performance tuning.
   - Cloud Platforms: AWS, Azure, Google Cloud fundamentals.

2. Technical Evaluation:
   - 3-4 coding problems with varying difficulty levels.
   - Architecture and design pattern discussions.

3. Behavioral/HR:
   - Wipro's SPIRIT values alignment.
   - Cross-functional collaboration and teamwork.
   - Client relationship management and service delivery.
   - Adaptability to different industry verticals.

Wipro-Specific Insights:
- Focus on end-to-end solution delivery and client satisfaction.
- Emphasis on digital engineering and platform thinking.
- Questions about working across different time zones and global teams.
`,

  "hcl": `
Technical Interviews at HCL Technologies focus on:
1. Core Topics:
   - Programming: Strong foundation in Java, .NET, or Python.
   - DSA: Algorithmic problem-solving and optimization techniques.
   - Web Technologies: Full-stack development capabilities.
   - Database: SQL mastery and database performance optimization.
   - DevOps: CI/CD pipelines, containerization, monitoring tools.

2. Technical Assessment:
   - 2-3 hands-on coding challenges.
   - Technical architecture and solution design discussions.

3. Behavioral/HR:
   - HCL's value system and cultural alignment.
   - Innovation mindset and creative problem-solving.
   - Client engagement and relationship building.
   - Flexibility to work across different technologies and domains.

HCL-Specific Insights:
- Strong focus on digital transformation and modernization.
- Emphasis on automation and intelligent operations.
- Questions about contributing to innovation labs and R&D initiatives.
`,

  "cognizant": `
Technical Interviews at Cognizant focus on:
1. Core Topics:
   - Programming: Proficiency in Java, JavaScript, Python, or .NET.
   - DSA: Strong algorithmic thinking and data structure manipulation.
   - Enterprise Frameworks: Spring, Angular, React, Node.js.
   - Database: Advanced SQL, NoSQL databases, data modeling.
   - Cloud & Digital: Multi-cloud expertise, digital engineering.

2. Technical Evaluation:
   - 3-4 coding problems with real-world scenarios.
   - System design and scalability discussions.

3. Behavioral/HR:
   - Cognizant's core values and commitment to diversity.
   - Client-first mindset and service excellence.
   - Collaborative working style and knowledge sharing.
   - Adaptability to rapidly changing technology landscape.

Cognizant-Specific Insights:
- Focus on digital business transformation and user experience.
- Emphasis on agile delivery and continuous improvement.
- Questions about working with global clients and cultural sensitivity.
`,

  "accenture": `
Technical Interviews at Accenture focus on:
1. Core Topics:
   - Technology Stack: Comprehensive knowledge across multiple platforms.
   - DSA: Problem-solving with focus on business applications.
   - Enterprise Solutions: SAP, Salesforce, cloud platforms integration.
   - Data & Analytics: SQL, data visualization, basic analytics concepts.
   - Emerging Tech: AI, blockchain, IoT, and digital technologies.

2. Technical Assessment:
   - 2-3 coding challenges with business context.
   - Consulting-style problem-solving scenarios.

3. Behavioral/HR:
   - Accenture's core values and inclusive culture.
   - Consulting mindset and client advisory capabilities.
   - Change management and transformation leadership.
   - Cross-industry experience and domain knowledge.

Accenture-Specific Insights:
- Strong focus on business consulting and technology integration.
- Emphasis on innovation and digital transformation strategies.
- Questions about managing complex projects and stakeholder relationships.
`,

  "capgemini": `
Technical Interviews at Capgemini focus on:
1. Core Topics:
   - Programming: Multi-technology expertise (Java, .NET, Python, JavaScript).
   - DSA: Algorithmic problem-solving with practical applications.
   - Enterprise Architecture: Microservices, API design, integration patterns.
   - Database: SQL optimization, data architecture, ETL processes.
   - Cloud & DevOps: Multi-cloud strategies, automation, and monitoring.

2. Technical Evaluation:
   - 2-4 coding problems with varying complexity.
   - Architecture design and best practices discussions.

3. Behavioral/HR:
   - Capgemini's values of honesty, boldness, and trust.
   - Collaborative innovation and team dynamics.
   - Client partnership and co-creation approach.
   - Sustainability and responsible business practices.

Capgemini-Specific Insights:
- Focus on intelligent industry solutions and digital innovation.
- Emphasis on collaborative engineering and agile delivery.
- Questions about contributing to sustainability initiatives and social impact.
`,

  "tech mahindra": `
Technical Interviews at Tech Mahindra focus on:
1. Core Topics:
   - Programming: Strong foundation in Java, C++, Python, or JavaScript.
   - DSA: Problem-solving with focus on telecom and automotive domains.
   - Networking: TCP/IP, network protocols, telecommunications basics.
   - Database: SQL mastery, data management, and analytics.
   - Emerging Tech: 5G, IoT, AI/ML, and mobility solutions.

2. Technical Assessment:
   - 2-3 coding challenges with domain-specific context.
   - Technical discussions around connectivity and mobility solutions.

3. Behavioral/HR:
   - Tech Mahindra's RISE values and innovation culture.
   - Adaptability to work across telecom and automotive verticals.
   - Global mindset and cross-cultural collaboration.
   - Passion for emerging technologies and digital transformation.

Tech Mahindra-Specific Insights:
- Strong focus on connected world solutions and mobility.
- Emphasis on 5G, IoT, and next-generation technologies.
- Questions about contributing to automotive and telecom innovation.
`,

  "general": `
Technical Interviews in Indian IT firms (Service-based companies) focus on:
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
   - Logistics: Relocation/night shift willingness, handling role changes.
   - Teamwork: Past conflict resolution examples.

Key Insights:
- Technical: LeetCode-style coding, OS/DBMS fundamentals, language-specific details.
- Behavioral: Communication, culture fit, situational judgment.
- Preparation: Practice coding (DSA), rehearse HR questions, research company tech stack.
`
};

function getCompanyContext(companyName: string) {
  if (!companyName) return companyContexts.general;

  const normalizedCompany = companyName.toLowerCase().trim();
  if (normalizedCompany in companyContexts) {
    return companyContexts[normalizedCompany as keyof typeof companyContexts];
  }
  return companyContexts.general;
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid, company } = await request.json();
  const companyContext = getCompanyContext(company);
  
  try {
    // Base prompt for regular questions
    const basePrompt = `Prepare questions for a job interview.
      The context is: ${companyContext}
      The job role is ${role}.
      The job experience level is ${level}.
      The tech stack used in the job is: ${techstack}.
      The focus between behavioural and technical questions should lean towards: ${type}.
      The amount of questions required is: ${amount}.`;

    // Add restrictions based on interview type
    const restrictions = type.toLowerCase() === 'technical'
      ? `For the regular questions: Do not give questions which require text input or a whiteboard to solve.`
      : `Do not give questions which require a code editor, text input or a whiteboard to solve.`;

    // Add coding question instruction if type is Technical
    const fullPrompt = type.toLowerCase() === 'technical'
      ? `${basePrompt}
        ${restrictions}
        Important:
        - Return only the questions, without additional text
        - Avoid special characters that might break voice assistant
        - Format regular questions like: ["Question 1", "Question 2"]
        
        Plus one additional moderatly easy to medium DSA coding question only related to on numberd arrays, character arrays, strings, (add linked list, queues based on experience)  at the end (separate from the ${amount} questions).
        The coding question should be in this exact JSON format:
        {
          "title": "Problem Title",
          "difficulty": "Easy/Medium/Hard",
          "description": "Clear problem statement",
          "examples": ["Input: example1, Output: result1", "Input: example2, Output: result2"]
        }`
      : `${basePrompt}
        ${restrictions}
        Important:
        - Return only the questions, without additional text
        - Avoid special characters that might break voice assistant
        - Format like: ["Question 1", "Question 2"]`;

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: fullPrompt,
    });
    console.log("Generated Questions:", questions);
    let questionsList: string[] = [];
    let codingQuestion: CodeQuestion | null = null;

    if (type.toLowerCase() === 'technical') {
      try {
         console.log("Raw Questions Response:", questions);
        // Try to parse the response which should contain both regular questions and coding question
        // Split the response into parts
        const parts = questions.split('\n{');
        console.log("Split Parts:", parts);
        
        // Parse regular questions (first part)
        questionsList = JSON.parse(parts[0].trim());
         console.log("Parsed Regular Questions:", questionsList);
        
        // Parse coding question (second part)
        if (parts.length > 1) {
          codingQuestion = JSON.parse(`{${parts[1].trim()}`);
          console.log("Parsed Coding Question:", codingQuestion);
        } else {
          codingQuestion = {
            title: `${techstack} Coding Problem`,
            difficulty: "Medium",
            description: `Implement a solution for a common ${techstack} problem`,
            examples: []
          };
        }
      } catch (e) {
        // Fallback if parsing fails
        questionsList = JSON.parse(questions);
        codingQuestion = {
          title: `${techstack} Coding Problem`,
          difficulty: "Medium",
          description: `Implement a solution for a common ${techstack} problem`,
          examples: []
        };
        
      }
    } else {
      questionsList = JSON.parse(questions);
    }

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: questionsList, 
      codingQuestion: codingQuestion || null,
      company: company,
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
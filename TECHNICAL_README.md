# Technical Documentation: AI Mock Interview Platform

## 🚀 Project Overview
This represents a cutting-edge **AI-powered Interview Preparation Platform** that simulates real-world technical and behavioral interviews. It leverages **Generative AI (Gemini 2.0)**, **Real-time Voice Processing (Vapi)**, and **Sandboxed Code Execution (Piston)** to provide candidates with immediate, actionable feedback.

> **Interview Pitch**: "I built this to solve the feedback loop problem in interview prep. Most platforms just give you a question; this one acts as a real-time interviewer that listens, evaluates your code, and provides structured grading based on industry standards."

---

## 🛠 Tech Stack & Rationale

| Layer | Technology | Why this choice? (Interview Answers) |
|-------|------------|--------------------------------------|
| **Framework** | **Next.js 15 (App Router)** | For server-side rendering (SEO) and **Server Actions**, which simplified the API layer by allowing direct database mutations from the frontend without setting up a separate Express server. |
| **Language** | **TypeScript** | To ensure type safety, especially when dealing with complex complex data structures like the Interview and Feedback objects. |
| **AI Model** | **Google Gemini 2.0 Flash** | Chosen via **Vercel AI SDK**. Flash 2.0 offers the best latency-to-cost ratio for real-time applications, essential for maintaining a conversational flow. |
| **Voice AI** | **Vapi** | Handles the complexity of Voice Activity Detection (VAD) and speech-to-text streaming, reducing the latency that would occur if I built a custom websocket solution. |
| **Database** | **Firebase (Firestore)** | NoSQL structure was perfect for the variable nature of interview "Documents" (transcripts, flexible metadata) and allowed for rapid iteration of the schema. |
| **Code Execution** | **Piston API** | **Security Decision**: Executing user code is dangerous (RCE risk). I used Piston to offload execution to a sandboxed environment, isolating my server from malicious code. |
| **Styling** | **Tailwind + Shadcn UI** | For rapid UI development with accessibility built-in. |

---

## 🏗 System Architecture & Key Patterns

### 1. Hybrid AI Orchestration
The system uses a two-pronged AI approach:
*   **Conversational Layer**: Handled by **Vapi**, which manages the audio stream and "personality" of the interviewer.
*   **Analytical Layer**: Handled by **Gemini 2.0** (via `generateObject`).
    *   *Challenge*: Parsing unstructured LLM text is brittle.
    *   *Solution*: I implemented **Structured Outputs** using the Vercel AI SDK (`generateObject` + `zod` schemas). This forces the LLM to return strictly typed JSON, eliminating runtime errors in the feedback generation pipeline.

### 2. Secure Code Execution Pipeline
When a user submits code during a technical interview:
1.  **Client-Side**: The Monaco Editor captures input.
2.  **Wrapper**: The code is wrapped in a language-specific boilerplate (handled in `code-editor.tsx`) to ensure it runs as a standalone script.
3.  **Sandboxing**: Code is sent to the **Piston API** (external sandbox).
4.  **Verification**: The output (stdout/stderr) is captured and sent back to the LLM (Gemini) to evaluate *correctness* and *efficiency*, not just syntax.

### 3. Asynchronous Feedback Generation
Feedback isn't just a simple API call. It involves:
*   Aggregating the full chat transcript.
*   Merging code execution results.
*   Running a multi-step evaluation prompt.
*   **Batch Writes**: Using Firestore batch operations to ensure atomicity—updating the user's credits and saving the feedback simultaneously. If one fails, both fail, preserving data integrity.

---

## 💡 "Impressive" Implementation Details

### A. Handling "Flaky" LLM Responses
*Problem*: Early versions using `generateText` would sometimes return Markdown or introduction text instead of pure JSON, breaking the app.
*Solution*: I refactored the backend (`api/vapi/generate/route.ts`) to use `generateObject`. This creates a **Type-Validated Guarantee**—if the LLM output doesn't match the Zod schema, the SDK automatically retries or throws a structured error we can handle gracefully.

### B. Real-time State Synchronization
*Problem*: Syncing the Voice Agent's state (Talking, Listening) with the UI (Webcam, transcript).
*Solution*: Implemented an event-driven hook system in `Agent.tsx`. By subscribing to Vapi events (`speech-start`, `transcript`), I achieved sub-second latency updates in the UI, making the avatar feel "alive".

### C. Dynamic Context Injection
*Feature*: The system injects specific company contexts (e.g., "TCS focuses on Core Java", "Google focuses on Graphs") into the prompt.
*Implementation*: A lookup strategy pattern in the route handler allows the AI to "roleplay" specific company interviewers dynamically without needing separate fine-tuned models.

---

## 📂 Key File Structure
*   `app/api/vapi/generate/route.ts`: Core logic for interview generation. **(See: Zod Schema validation)**
*   `lib/actions/general.action.ts`: Server Actions handling complex DB mutations. **(See: Batch writes)**
*   `components/custom/code-editor.tsx`: The sandboxing integration logic. **(See: Piston API call)**
*   `components/Agent.tsx`: The heart of the client-side experience. **(See: Event listeners)**

---

## 🚀 Future Improvements (The "Senior Engineer" Perspective)
1.  **WebSocket Integration**: Move from short-polling/events to a dedicated WebSocket for even lower latency code collaboration.
2.  **Rate Limiting**: Implement Redis-based rate limiting on the API routes to prevent abuse (Token Bucket algorithm).
3.  **Testing**: Add E2E tests using Playwright to verify the full user flow (Voice -> Code -> Feedback).

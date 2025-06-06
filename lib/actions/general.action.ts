"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId, codeData } = params;
    console.log("Code Data:", codeData);
    
    try {   
        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `- ${sentence.role}: ${sentence.content}\n`
            )
            .join("");

        // Prepare code evaluation section if code exists
        const codeEvaluationSection = codeData?.code ? `
        \n\n### Code Submission Analysis:
        **Language:** ${codeData.language}
        **Coding Question:** ${codeData.codingQuestion}
        **Code Submitted:**
        \`\`\`${codeData.language}
        ${codeData.code}
        \`\`\`
        
        **Execution Output:**
        ${codeData.output}
        ` : '';

        // Determine which prompt to use based on whether code exists
        const { prompt, system } = codeData?.code 
            ? {
                // Technical prompt (when code exists)
                prompt: `
                You are a senior technical interviewer analyzing a mock interview. Your task is to critically evaluate the candidate based on structured categories. Be extremely thorough and strict in your analysis. Don't be lenient - if there are mistakes or areas for improvement, point them out explicitly. Hold candidates to high professional standards.

                **Interview Transcript:**
                ${formattedTranscript}
                
                ${codeEvaluationSection}

                Please evaluate the candidate STRICTLY using these guidelines:
                1. **Communication Skills** (0-100): 
                   - Evaluate clarity, articulation, and structured responses
                   - Deduct points for unclear explanations, rambling, or poor organization
                   - Average score should be 60-70 for adequate performance

                2. **Technical Knowledge** (0-100):
                   - Assess depth of technical understanding
                   - Deduct heavily for incorrect concepts or shallow answers
                   - Only give >80 for demonstrated expertise

                3. **Problem-Solving** (0-100):
                   - Evaluate analytical approach and solution quality
                   - Deduct for brute-force solutions or lack of optimization
                   - Reward systematic breakdown of problems

                4. **Cultural & Role Fit** (0-100):
                   - Assess alignment with professional standards
                   - Deduct for poor attitude or mismatch with role requirements
                   - Reward demonstrated professionalism

                5. **Confidence & Clarity** (0-100):
                   - Evaluate poise and presentation
                   - Deduct for hesitation, uncertainty, or lack of engagement
                   - Reward clear, confident delivery

                **Code Evaluation Criteria** (if applicable):
                - Correctness (50% weight): Does the code work correctly?
                - Efficiency (20%): Is the solution optimal?
                - Readability (20%): Is the code clean and maintainable?
                - Style (10%): Does it follow language conventions?
                `,
                system: `
                You are a little strict technical interviewer with high standards. 
                Your feedback should be professional but critical. 
                Never inflate scores - be honest about shortcomings.
                Provide specific examples from the transcript/code to justify your evaluation.
                `
            } 
            : {
                // General prompt (when no code exists)
                prompt: `
                You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
                Transcript:
                ${formattedTranscript}
                
                Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
                - **Communication Skills**: Clarity, articulation, structured responses.
                - **Technical Knowledge**: Understanding of key concepts for the role.
                - **Problem-Solving**: Ability to analyze problems and propose solutions.
                - **Cultural & Role Fit**: Alignment with company values and job role.
                - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
                `,
                system: `
                You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories.
                `
            };

        const { object } = await generateObject({
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,
            prompt,
            system
        });

        const feedback = {
            interviewId: interviewId,
            userId: userId,
            totalScore: object.totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
            ...(codeData && { 
                codeData: {
                    language: codeData.language,
                    code: codeData.code,
                    output: codeData.output,
                    codeEvaluation: object.codeEvaluation 
                }
            })
        };

        let feedbackRef;

        if (feedbackId) {
            feedbackRef = db.collection("feedback").doc(feedbackId);
        } else {
            feedbackRef = db.collection("feedback").doc();
        }

        const batch = db.batch();
        batch.set(feedbackRef, feedback);

        const interviewRef = db.collection("interviews").doc(interviewId);
        batch.update(interviewRef, { finalized: true });

        await batch.commit();

        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("Error saving feedback:", error);
        return { success: false };
    }
}

export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    const querySnapshot = await db
        .collection("feedback")
        .where("interviewId", "==", interviewId)
        .where("userId", "==", userId)
        .limit(1)
        .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getFeedbackByUserId(
    params: GetFeedbackByUserIdParams
): Promise<Feedback[]> {
    const { userId } = params;

    const querySnapshot = await db
        .collection("feedback")
        .where("userId", "==", userId)
        .get();

    if (querySnapshot.empty) return [];

    const feedbackArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Feedback[];

    return feedbackArray;
}


export async function getInterviewsByUserId(userid: string): Promise<Interview[] | null> {
    const interviews = await db
        .collection("interviews")
        .where("userId", "==", userid)
        .orderBy("createdAt", "desc")
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params

    const interviews = await db
        .collection("interviews")
        .orderBy("createdAt", "desc")
        .where("finalized", "==", false)
        .where("userId", "==", userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interview = await db
        .collection("interviews")
        .doc(id)
        .get();

    return interview.data() as Interview | null;
}




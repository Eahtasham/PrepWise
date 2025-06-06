interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  codingQuestion?: {
    title: string;
    difficulty: string;
    description: string;
    examples: string[];
  }
  techstack: string[];
  createdAt: string;
  coverImage: string,
  userId: string;
  type: string;
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
  codeData?: any;

}

interface User {
  name: string;
  email: string;
  isVerified: boolean;
  isPro: boolean;
  provider: string;
  photoURL?: string;
  createdAt: string;
  id: string;
}

interface InterviewCardProps {
  id?: string;
  userId?: string;
  role: string;
  type: string;
  coverImage?: string;
  finalized: boolean;
  techstack: string[];
  createdAt?: string;
}

interface AgentProps {
  userName: string | undefined;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
  codingQuestion?: {
    title: string;
    difficulty: string;
    description: string;
    examples: string[];
  }
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetFeedbackByUserIdParams {
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface OAuthSignInParams {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  provider: 'google' | 'github';
  idToken: string;
}
type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

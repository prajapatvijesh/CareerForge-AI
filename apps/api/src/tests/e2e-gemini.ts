import mongoose from 'mongoose';
import { env } from '../config/env';
import { AnalysisService } from '../modules/resume-analysis/analysis.service';
import { MockInterviewService } from '../modules/mock-interview/mock-interview.service';
import { GoogleGenAI } from '@google/genai';
import { Resume } from '../modules/resume/resume.model';
import { User } from '../modules/auth/user.model';

const report = {
  phases: {} as any,
  passed: 0,
  failed: 0,
};

async function logPhase(name: string, fn: () => Promise<void>) {
  try {
    console.log(`\n--- Starting Phase: ${name} ---`);
    await fn();
    report.phases[name] = { status: 'PASS' };
    report.passed++;
    console.log(`[PASS] ${name}`);
  } catch (err: any) {
    report.phases[name] = { status: 'FAIL', error: err.message, stack: err.stack };
    report.failed++;
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Clean up old test data
  await User.deleteMany({ email: 'e2e_test@example.com' });
  await User.deleteMany({ email: 'e2e_hacker@example.com' });

  const testUser = await User.create({
    name: 'E2E Test User',
    email: 'e2e_test@example.com',
    password: 'password123',
    role: 'user'
  });

  const hackerUser = await User.create({
    name: 'E2E Hacker',
    email: 'e2e_hacker@example.com',
    password: 'password123',
    role: 'user'
  });

  const resume = await Resume.create({
    userId: testUser._id,
    title: 'Senior Frontend Developer',
    summary: 'Experienced React developer with 5 years in building scalable web applications using TypeScript and Next.js.',
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js'],
    experience: [{
      company: 'Tech Corp',
      role: 'Frontend Engineer',
      description: 'Built the core frontend application. Increased performance by 40%.',
      startDate: new Date('2020-01-01'),
      endDate: new Date('2024-01-01')
    }]
  });

  const analysisService = new AnalysisService();
  const mockInterviewService = new MockInterviewService();

  // PHASE 1: Gemini Connectivity
  await logPhase('Phase 1: Real Gemini configuration and model availability', async () => {
    if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === 'mock_key') throw new Error("API key is not configured.");
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: "Say 'OK' if you are working."
    });
    if (!response.text?.includes('OK')) {
      throw new Error("Model responded but not as expected: " + response.text);
    }
  });

  // PHASE 2: Resume Analysis E2E
  await logPhase('Phase 2: Resume Analysis E2E', async () => {
    // Trigger Analysis
    const pendingAnalysis = await analysisService.triggerAnalysis(
      testUser._id.toString(),
      resume._id.toString(),
      'gemini',
      'Looking for a Senior Frontend Developer expert in React and TypeScript.'
    );
    let current = pendingAnalysis;
    let attempts = 0;
    while (current.status === 'PENDING' || current.status === 'PROCESSING') {
      if (attempts > 30) throw new Error("Timeout waiting for analysis to complete.");
      await delay(2000);
      const fetched = await analysisService.getLatestAnalysis(testUser._id.toString(), resume._id.toString());
      if (!fetched) throw new Error("Analysis disappeared from DB.");
      current = fetched;
      attempts++;
    }

    if (current.status === 'FAILED') {
      throw new Error("Analysis failed: " + current.errorMessage);
    }

    // Validate fields
    if (typeof current.atsScore !== 'number') throw new Error("Missing ATS Score");
    if (!current.keywords?.present || !current.keywords?.missing) throw new Error("Missing keywords");
    if (!current.strengths?.length || !current.weaknesses?.length || !current.suggestions?.length) throw new Error("Missing detailed feedback arrays");
  });

  let interviewId = '';

  // PHASE 3: Mock Interview E2E
  await logPhase('Phase 3: Mock Interview E2E', async () => {
    // Start Interview
    const interview = await mockInterviewService.startInterview(testUser._id.toString(), {
      role: 'Frontend Developer',
      difficulty: 'MEDIUM',
      company: 'Tech Corp',
      durationMinutes: 30,
      questionCount: 2,
    });
    interviewId = interview._id.toString();

    if (interview.questions.length !== 2) throw new Error("Expected 2 questions, got " + interview.questions.length);

    // Submit Answers
    await mockInterviewService.submitAnswer(testUser._id.toString(), interviewId, {
      questionId: interview.questions[0].id,
      answerText: "I use React hooks like useEffect to manage side effects, and state for local data."
    });
    await mockInterviewService.submitAnswer(testUser._id.toString(), interviewId, {
      questionId: interview.questions[1].id,
      answerText: "I optimize performance by using useMemo and lazy loading components."
    });

    // Finish Interview
    await mockInterviewService.finishInterview(testUser._id.toString(), interviewId);

    // Poll for evaluation
    let current = await mockInterviewService.getInterview(testUser._id.toString(), interviewId);
    let attempts = 0;
    while (current.status === 'IN_PROGRESS' || current.status === 'PENDING') {
      if (attempts > 30) throw new Error("Timeout waiting for evaluation to complete.");
      await delay(2000);
      current = await mockInterviewService.getInterview(testUser._id.toString(), interviewId);
      attempts++;
    }

    if (current.status === 'EVALUATION_FAILED') {
      throw new Error("Evaluation failed.");
    }

    if (current.status !== 'COMPLETED') {
      throw new Error("Unexpected status: " + current.status);
    }

    if (typeof current.overallResult?.totalScore !== 'number') throw new Error("Missing overall score");
    if (typeof current.answers[0].score !== 'number') throw new Error("Missing per-question score");
    if (!current.overallResult?.strengths?.length) throw new Error("Missing overall strengths");
  });

  // PHASE 6: Security and Ownership
  await logPhase('Phase 6: Security and ownership validation', async () => {
    try {
      await analysisService.triggerAnalysis(hackerUser._id.toString(), resume._id.toString(), 'gemini');
      throw new Error("Hacker was able to trigger analysis on another user's resume!");
    } catch (err: any) {
      if (err.message.includes('Hacker was able')) throw err;
      if (err.statusCode !== 404 && err.statusCode !== 403) {
         throw new Error("Unexpected error code for ownership violation: " + err.message);
      }
    }

    try {
      await mockInterviewService.getInterview(hackerUser._id.toString(), interviewId);
      throw new Error("Hacker was able to read another user's interview!");
    } catch (err: any) {
      if (err.message.includes('Hacker was able')) throw err;
    }
  });

  // Cleanup
  await User.deleteMany({ email: 'e2e_test@example.com' });
  await User.deleteMany({ email: 'e2e_hacker@example.com' });
  await mongoose.disconnect();

  console.log('\n--- Final E2E Report Summary ---');
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});

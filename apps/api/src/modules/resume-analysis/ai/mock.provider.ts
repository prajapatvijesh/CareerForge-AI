import { IAIProvider, IAnalysisResult } from './ai-provider.interface';

/**
 * A mock provider for development and testing.
 * In a real scenario, this would use the official @google/genai SDK.
 */
export class MockResumeProvider implements IAIProvider {
  public async analyzeResume(_resumeText: string, _jobDescription?: string): Promise<IAnalysisResult> {
    // Simulate AI network delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulated robust response
    return {
      atsScore: Math.floor(Math.random() * 20) + 75, // Random score between 75-95
      keywords: {
        present: ['React', 'TypeScript', 'Node.js', 'Clean Architecture'],
        missing: ['Docker', 'Kubernetes', 'CI/CD']
      },
      strengths: [
        'Strong progressive experience in frontend technologies.',
        'Clear demonstration of architectural patterns.',
        'Good use of metrics in bullet points.'
      ],
      weaknesses: [
        'Lacks cloud deployment experience.',
        'Summary section is slightly generic.',
        'Some bullet points are too long and hard to scan.'
      ],
      suggestions: [
        'Add specific cloud services you have worked with (e.g., AWS S3, Vercel).',
        'Quantify the impact of the dashboard project (e.g., "reduced loading time by 30%").',
        'Tailor the summary to specifically highlight leadership or mentorship roles.'
      ]
    };
  }
}

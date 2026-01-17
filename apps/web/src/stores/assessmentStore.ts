import { create } from 'zustand';
import {
  Assessment,
  AssessmentSummary,
  AssessmentResult,
  ResponseItem,
} from '@/types/assessment';
import { assessmentApi, resultsApi } from '@/lib/api';

interface AssessmentState {
  // List of assessments
  assessments: AssessmentSummary[];
  isLoadingAssessments: boolean;

  // Current assessment being taken
  currentAssessment: Assessment | null;
  currentResult: AssessmentResult | null;
  responses: Record<string, ResponseItem>;
  currentQuestionIndex: number;
  isSubmitting: boolean;

  // User's results
  results: AssessmentResult[];
  isLoadingResults: boolean;

  // Error handling
  error: string | null;

  // Actions
  fetchAssessments: (type?: string, academicLevel?: string) => Promise<void>;
  fetchAssessment: (id: string) => Promise<void>;
  startAssessment: (assessmentId: string) => Promise<void>;
  setResponse: (questionId: string, value: number | string | (number | string)[]) => void;
  saveProgress: () => Promise<void>;
  submitAssessment: () => Promise<AssessmentResult>;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  resetAssessment: () => void;
  fetchResults: () => Promise<void>;
  clearError: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  assessments: [],
  isLoadingAssessments: false,
  currentAssessment: null,
  currentResult: null,
  responses: {},
  currentQuestionIndex: 0,
  isSubmitting: false,
  results: [],
  isLoadingResults: false,
  error: null,

  fetchAssessments: async (type?: string, academicLevel?: string) => {
    set({ isLoadingAssessments: true, error: null });
    try {
      const assessments = await assessmentApi.getAll(type, academicLevel);
      set({ assessments, isLoadingAssessments: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch assessments';
      set({ error: message, isLoadingAssessments: false });
    }
  },

  fetchAssessment: async (id: string) => {
    set({ error: null });
    try {
      const assessment = await assessmentApi.getById(id);
      set({ currentAssessment: assessment });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch assessment';
      set({ error: message });
      throw error;
    }
  },

  startAssessment: async (assessmentId: string) => {
    set({ error: null });
    try {
      // Fetch the assessment details
      const assessment = await assessmentApi.getById(assessmentId);
      // Start the assessment session
      const result = await assessmentApi.start(assessmentId);

      // If there are existing responses (resumed session), restore them
      const responses: Record<string, ResponseItem> = {};
      if (result.responses) {
        for (const response of result.responses) {
          responses[response.questionId] = response;
        }
      }

      set({
        currentAssessment: assessment,
        currentResult: result,
        responses,
        currentQuestionIndex: 0,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start assessment';
      set({ error: message });
      throw error;
    }
  },

  setResponse: (questionId: string, value: number | string | (number | string)[]) => {
    set((state) => ({
      responses: {
        ...state.responses,
        [questionId]: { questionId, value },
      },
    }));
  },

  saveProgress: async () => {
    const { currentResult, responses } = get();
    if (!currentResult) return;

    try {
      const responseArray = Object.values(responses);
      await assessmentApi.saveProgress(currentResult.id, responseArray);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  },

  submitAssessment: async () => {
    const { currentResult, responses } = get();
    if (!currentResult) {
      throw new Error('No assessment in progress');
    }

    set({ isSubmitting: true, error: null });
    try {
      const responseArray = Object.values(responses);
      const result = await assessmentApi.submit(currentResult.id, responseArray);
      set({
        currentResult: result,
        isSubmitting: false,
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit assessment';
      set({ error: message, isSubmitting: false });
      throw error;
    }
  },

  nextQuestion: () => {
    const { currentAssessment, currentQuestionIndex } = get();
    if (!currentAssessment) return;

    if (currentQuestionIndex < currentAssessment.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  goToQuestion: (index: number) => {
    const { currentAssessment } = get();
    if (!currentAssessment) return;

    if (index >= 0 && index < currentAssessment.questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  resetAssessment: () => {
    set({
      currentAssessment: null,
      currentResult: null,
      responses: {},
      currentQuestionIndex: 0,
      isSubmitting: false,
    });
  },

  fetchResults: async () => {
    set({ isLoadingResults: true, error: null });
    try {
      const results = await resultsApi.getAll();
      set({ results, isLoadingResults: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch results';
      set({ error: message, isLoadingResults: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

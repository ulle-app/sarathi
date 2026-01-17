'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { QuestionDisplay, AssessmentProgress } from '@/components/assessment';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { toast } from 'sonner';

export default function TakeAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const {
    currentAssessment,
    currentResult,
    responses,
    currentQuestionIndex,
    isSubmitting,
    error,
    startAssessment,
    setResponse,
    saveProgress,
    submitAssessment,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    resetAssessment,
  } = useAssessmentStore();

  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const initAssessment = async () => {
      try {
        await startAssessment(assessmentId);
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    };

    initAssessment();

    return () => {
      // Save progress when leaving the page
      saveProgress();
    };
  }, [assessmentId, startAssessment, saveProgress]);

  const handleStartAssessment = () => {
    setIsStarted(true);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      const result = await submitAssessment();
      toast.success('Assessment Completed!', {
        description: 'Your results are being analyzed. Redirecting to your results...',
      });
      // Navigate to results page
      router.push(`/results/${result.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit assessment';
      setSubmitError(errorMessage);
      toast.error('Submission Failed', {
        description: errorMessage,
      });
    }
  };

  const currentQuestion = currentAssessment?.questions[currentQuestionIndex];
  const currentResponse = currentQuestion ? responses[currentQuestion.id] : null;
  const answeredQuestions = new Set(Object.keys(responses));
  const allAnswered = currentAssessment
    ? answeredQuestions.size >= currentAssessment.questions.length
    : false;
  const isLastQuestion = currentAssessment
    ? currentQuestionIndex === currentAssessment.questions.length - 1
    : false;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // Error state
  if (error || !currentAssessment) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
          Unable to Load Assessment
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {error || 'Assessment not found'}
        </p>
        <Button className="mt-4" onClick={() => router.push('/assessment')}>
          Back to Assessments
        </Button>
      </div>
    );
  }

  // Introduction screen
  if (!isStarted) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{currentAssessment.title}</CardTitle>
            <CardDescription className="mt-2 text-base">
              {currentAssessment.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {currentAssessment.questions.length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Questions</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {currentAssessment.estimatedMinutes}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Minutes</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800">
                <p className="text-2xl font-bold capitalize text-primary-600 dark:text-primary-400">
                  {currentAssessment.type}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Type</p>
              </div>
            </div>

            <div className="space-y-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              <p className="font-medium">Instructions:</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Answer each question honestly based on your first instinct</li>
                <li>There are no right or wrong answers</li>
                <li>Your progress is saved automatically</li>
                <li>You can navigate between questions using the progress bar</li>
              </ul>
            </div>

            {currentResult?.status === 'in_progress' && answeredQuestions.size > 0 && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
                <p className="font-medium">Resuming Previous Session</p>
                <p className="mt-1">
                  You have {answeredQuestions.size} of {currentAssessment.questions.length} questions answered.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/assessment')}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleStartAssessment}>
                {currentResult?.status === 'in_progress' && answeredQuestions.size > 0
                  ? 'Continue Assessment'
                  : 'Start Assessment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Assessment taking UI
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-white/95 py-4 backdrop-blur dark:bg-slate-900/95">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {currentAssessment.title}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              saveProgress();
              toast.info('Progress Saved', {
                description: 'Your answers have been saved. You can continue anytime.',
              });
              router.push('/assessment');
            }}
          >
            Save & Exit
          </Button>
        </div>
        <div className="mt-4">
          <AssessmentProgress
            currentIndex={currentQuestionIndex}
            totalQuestions={currentAssessment.questions.length}
            answeredQuestions={answeredQuestions}
            questionIds={currentAssessment.questions.map((q) => q.id)}
            onQuestionClick={goToQuestion}
          />
        </div>
      </div>

      {/* Question card */}
      {currentQuestion && (
        <Card>
          <CardContent className="p-6 sm:p-8">
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={currentAssessment.questions.length}
              value={currentResponse?.value ?? null}
              onChange={(value) => setResponse(currentQuestion.id, value)}
            />
          </CardContent>
        </Card>
      )}

      {/* Submit error */}
      {submitError && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {submitError}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {isLastQuestion && allAnswered ? (
            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Submit Assessment
            </Button>
          ) : isLastQuestion ? (
            <Button variant="outline" disabled>
              Answer all questions to submit
            </Button>
          ) : (
            <Button onClick={nextQuestion}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

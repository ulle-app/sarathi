'use client';

import { AssessmentQuestion } from '@/types/assessment';
import { LikertScale, SliderInput, MultipleChoice, RankingInput } from './AnswerOptions';

interface QuestionDisplayProps {
  question: AssessmentQuestion;
  questionNumber: number;
  totalQuestions: number;
  value: number | string | (number | string)[] | null;
  onChange: (value: number | string | (number | string)[]) => void;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  value,
  onChange,
}: QuestionDisplayProps) {
  const renderAnswerInput = () => {
    switch (question.type) {
      case 'likert':
        return (
          <LikertScale
            value={value as number | null}
            onChange={(v) => onChange(v)}
            scale={question.scale ? { min: question.scale.min, max: question.scale.max } : undefined}
          />
        );

      case 'slider':
        return (
          <SliderInput
            value={value as number | null}
            onChange={(v) => onChange(v)}
            scale={question.scale}
          />
        );

      case 'multiple_choice':
        return (
          <MultipleChoice
            value={value as string | number | null}
            onChange={(v) => onChange(v)}
            options={question.options || []}
          />
        );

      case 'ranking':
        return (
          <RankingInput
            value={value as (string | number)[] | null}
            onChange={(v) => onChange(v)}
            options={question.options || []}
          />
        );

      default:
        return <p className="text-red-500">Unknown question type: {question.type}</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          Question {questionNumber} of {totalQuestions}
        </span>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {question.text}
        </h2>
        {question.dimension && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Dimension: {question.dimension}
          </span>
        )}
      </div>

      <div className="pt-4">
        {renderAnswerInput()}
      </div>
    </div>
  );
}

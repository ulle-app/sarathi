'use client';

import { useEffect, useState } from 'react';
import { ClipboardList, Loader2, Filter } from 'lucide-react';
import { useAssessmentStore } from '@/stores/assessmentStore';
import { useAuthStore } from '@/stores/authStore';
import { AssessmentCard } from '@/components/assessment';
import { Button } from '@/components/ui/Button';

const assessmentTypes = [
	{ value: '', label: 'All Types' },
	{ value: 'personality', label: 'Personality' },
	{ value: 'aptitude', label: 'Aptitude' },
	{ value: 'interest', label: 'Interest' },
	{ value: 'skill', label: 'Skill' },
];

export default function AssessmentListPage() {
	const { assessments, isLoadingAssessments, error, fetchAssessments } = useAssessmentStore();
	const { user } = useAuthStore();
	const [selectedType, setSelectedType] = useState('');

	useEffect(() => {
		// Pass user's academic level to fetchAssessments to tailor the list
		fetchAssessments(selectedType || undefined, user?.profile?.academicLevel);
	}, [selectedType, fetchAssessments, user?.profile?.academicLevel]);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assessments</h1>
				<p className="mt-2 text-slate-600 dark:text-slate-400">
					Choose an assessment to discover more about yourself
				</p>
			</div>

			{/* Tailoring banner */}
			{user?.profile?.academicLevel && (
				<div className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800/50 dark:bg-slate-900/30 dark:text-slate-300">
					<strong>Note:</strong> Assessments are tailored to your academic status. Showing assessments suitable for <span className="font-medium">{user.profile.academicLevel === 'grade_10' ? 'Grade 10' : user.profile.academicLevel === 'grade_12' ? 'Grade 12' : 'Professional'}</span> learners.
				</div>
			)}

			{/* Filter */}
			<div className="flex items-center gap-2">
				<Filter className="h-5 w-5 text-slate-400" />
				<div className="flex gap-2">
					{assessmentTypes.map((type) => (
						<Button
							key={type.value}
							variant={selectedType === type.value ? 'primary' : 'outline'}
							size="sm"
							onClick={() => setSelectedType(type.value)}
						>
							{type.label}
						</Button>
					))}
				</div>
			</div>

			{/* Loading state */}
			{isLoadingAssessments && (
				<div className="flex items-center justify-center py-16">
					<Loader2 className="h-8 w-8 animate-spin text-primary-600" />
				</div>
			)}

			{/* Error state */}
			{error && (
				<div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
					{error}
				</div>
			)}

			{/* Empty state */}
			{!isLoadingAssessments && !error && assessments.length === 0 && (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<ClipboardList className="h-16 w-16 text-slate-300 dark:text-slate-600" />
					<h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
						No Assessments Available
					</h2>
					<p className="mt-2 text-slate-600 dark:text-slate-400">
						{selectedType
							? `No ${selectedType} assessments are currently available.`
							: 'Check back later for new assessments.'}
					</p>
				</div>
			)}

			{/* Assessment grid */}
			{!isLoadingAssessments && !error && assessments.length > 0 && (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{assessments.map((assessment) => (
						<AssessmentCard key={assessment.id} assessment={assessment} />
					))}
				</div>
			)}
		</div>
	);
}

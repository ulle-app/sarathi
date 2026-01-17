'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Loader2,
  Search,
  Filter,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { careerApi } from '@/lib/api';
import { CareerSummary, CareerRecommendation } from '@/types/career';
import { CareerCard } from '@/components/career';
import { CareerMatchChart } from '@/components/charts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import MultiSelect from '@/components/ui/MultiSelect';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { useAuth } from '@/hooks/useAuth';

export default function CareerPathsPage() {
  const [careers, setCareers] = useState<CareerSummary[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoadingCareers, setIsLoadingCareers] = useState(true);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState<string[]>([]);
  const [studentFriendlyOnly, setStudentFriendlyOnly] = useState(false);

  // Filter careers based on user profile if available
  const { user } = useAuth(); // Assuming useAuth is available in this file or imported
  
  useEffect(() => {
    // If user has academic level, pre-select filters to tailor the view
    if (user?.profile?.academicLevel && !selectedEducationLevels.length && !studentFriendlyOnly) {
      const level = user.profile.academicLevel;
      
      switch (level) {
        case 'grade_10':
          // Grade 10 students need student-friendly options and broad stream guidance
          setStudentFriendlyOnly(true);
          break;
        case 'grade_12':
          // Grade 12 students are looking for undergraduate degrees
          setSelectedEducationLevels(['Bachelor', 'Undergraduate', 'Certificate']);
          break;
        case 'undergraduate':
          // Undergrads are looking for masters or entry-level professional roles
          setSelectedEducationLevels(['Master', 'Post-Graduate', 'Professional']);
          break;
        case 'post_graduate':
          // Post-grads are looking for specialized or senior roles
          setSelectedEducationLevels(['Professional', 'Specialized', 'PhD']);
          break;
        default:
          break;
      }
    }
  }, [user, selectedEducationLevels.length, studentFriendlyOnly]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all careers
      setIsLoadingCareers(true);
      try {
        const [careersData, categoriesData] = await Promise.all([
          careerApi.getAll(selectedCategory || undefined, searchQuery || undefined, {
            recommended_streams: selectedStreams.length > 0 ? selectedStreams : undefined,
            education_levels: selectedEducationLevels.length > 0 ? selectedEducationLevels : undefined,
            is_student_friendly: studentFriendlyOnly ? true : undefined,
          }),
          careerApi.getCategories(),
        ]);
        setCareers(careersData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load careers');
      } finally {
        setIsLoadingCareers(false);
      }

      // Fetch recommendations
      setIsLoadingRecommendations(true);
      try {
        const recsData = await careerApi.getRecommendations();
        setRecommendations(recsData);
        setRecommendationError(null);
      } catch (err) {
        setRecommendationError(
          err instanceof Error ? err.message : 'Complete an assessment to get personalized recommendations'
        );
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchData();
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Career Paths</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Explore careers that match your personality and skills
        </p>
      </div>

      {/* Personalized Recommendations Section */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Your Career Matches
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecommendations ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
              </div>
            ) : recommendationError ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  {recommendationError}
                </p>
                <Link href="/assessment" className="mt-4">
                  <Button>Take an Assessment</Button>
                </Link>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="space-y-6">
                <CareerMatchChart recommendations={recommendations} maxItems={5} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.slice(0, 3).map((rec) => (
                    <CareerCard
                      key={rec.career.id}
                      career={rec.career}
                      matchScore={rec.matchScore}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Compass className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-slate-600 dark:text-slate-400">
                  No recommendations yet. Complete an assessment to see your matches.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* All Careers Section */}
      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            All Careers
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search careers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 h-10"
              />
            </form>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select
                id="categorySelect"
                label={undefined}
                value={selectedCategory}
                options={[{ value: '', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
                onChange={(v: string) => setSelectedCategory(v)}
                className="w-48"
              />
            </div>

            {/* Student filters */}
            <div className="flex items-center gap-2">
              <MultiSelect
                id="streamsSelect"
                label={undefined}
                placeholder="Select streams"
                options={[
                  { value: 'science', label: 'Science' },
                  { value: 'commerce', label: 'Commerce' },
                  { value: 'arts', label: 'Arts' },
                  { value: 'vocational', label: 'Vocational' },
                  { value: 'design', label: 'Design' },
                  { value: 'trades', label: 'Trades' },
                  { value: 'engineering', label: 'Engineering' },
                  { value: 'medical', label: 'Medical' },
                ]}
                selected={selectedStreams}
                onChange={setSelectedStreams}
                className="w-56"
              />
            </div>

            <div className="flex items-center gap-2">
              <MultiSelect
                id="educationSelect"
                label={undefined}
                placeholder="Select education levels"
                options={[
                  { value: '10-12', label: '10-12' },
                  { value: 'undergraduate', label: 'Undergraduate' },
                  { value: 'postgraduate', label: 'Postgraduate' },
                  { value: 'diploma', label: 'Diploma' },
                  { value: 'certificate', label: 'Certificate' },
                ]}
                selected={selectedEducationLevels}
                onChange={setSelectedEducationLevels}
                className="w-56"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="studentFriendly" checked={studentFriendlyOnly} onChange={setStudentFriendlyOnly} label="Student friendly only" className="mt-0" />
            </div>
          </div>
        </div>

        {/* Loading state */}
        {isLoadingCareers && (
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
        {!isLoadingCareers && !error && careers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Compass className="h-16 w-16 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
              No Careers Found
            </h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {searchQuery || selectedCategory
                ? 'Try adjusting your search or filter.'
                : 'Check back later for new career options.'}
            </p>
          </div>
        )}

        {/* Careers grid */}
        {!isLoadingCareers && !error && careers.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {careers.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

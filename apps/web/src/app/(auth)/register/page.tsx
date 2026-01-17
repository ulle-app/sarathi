import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Create Account - SkillSphere',
  description: 'Create your SkillSphere account and start your career journey',
};

export default function RegisterPage() {
  return (
    <div className="card">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Create your account
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Start your personalized career journey today
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}

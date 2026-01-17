import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In - SkillSphere',
  description: 'Sign in to your SkillSphere account',
};

export default function LoginPage() {
  return (
    <div className="card">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Sign in to continue your career journey
        </p>
      </div>

      <LoginForm />
    </div>
  );
}

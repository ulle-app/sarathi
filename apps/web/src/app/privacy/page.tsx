import Link from 'next/link';
import { Brain, ArrowLeft, Shield, Lock, Eye, Database, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillSphere</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 17, 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="lead text-lg text-muted-foreground">
            At SkillSphere, we are committed to protecting your privacy and ensuring the security 
            of your personal information. This Privacy Policy explains how we collect, use, store, 
            and protect your data.
          </p>

          <hr className="my-8" />

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Database className="h-6 w-6 text-blue-600" />
              1. Information We Collect
            </h2>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">1.1 Account Information</h3>
            <p className="text-muted-foreground mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Email address (required for authentication)</li>
              <li>Name (optional, for personalization)</li>
              <li>Academic level (to tailor recommendations)</li>
              <li>Password (stored in hashed form, never in plain text)</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">1.2 Assessment Data</h3>
            <p className="text-muted-foreground mb-4">
              When you complete assessments, we collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your responses to assessment questions</li>
              <li>Calculated scores and results</li>
              <li>Career matches and recommendations generated</li>
              <li>Time spent on assessments</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">1.3 Usage Data</h3>
            <p className="text-muted-foreground mb-4">
              We automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Browser type and version</li>
              <li>Device type (desktop, mobile, tablet)</li>
              <li>Pages visited and features used</li>
              <li>Anonymous analytics data</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Lock className="h-6 w-6 text-green-600" />
              2. How We Protect Your Data
            </h2>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">2.1 Encryption at Rest</h3>
            <p className="text-muted-foreground mb-4">
              All personal data stored in our database is encrypted using AES-256 encryption. 
              This includes your name, assessment responses, and results. Even if our database 
              were compromised, your data would remain unreadable without the encryption keys.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2.2 Encryption in Transit</h3>
            <p className="text-muted-foreground mb-4">
              All data transmitted between your device and our servers is encrypted using TLS 1.3 
              (Transport Layer Security). This ensures that no one can intercept your data while 
              it travels over the internet.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2.3 Access Controls</h3>
            <p className="text-muted-foreground mb-4">
              Access to personal data is strictly limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>You, through your authenticated account</li>
              <li>Our automated systems for generating recommendations</li>
              <li>Authorized personnel for technical support (with your consent)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>No one can directly download or view your individual assessment responses</strong> 
              without proper authorization and encryption keys.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2.4 Secure Infrastructure</h3>
            <p className="text-muted-foreground">
              Our services are hosted on enterprise-grade cloud infrastructure with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Regular security audits</li>
              <li>Automatic security patches</li>
              <li>DDoS protection</li>
              <li>Firewall protection</li>
              <li>Intrusion detection systems</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
              3. How We Use Your Data
            </h2>
            
            <p className="text-muted-foreground mb-4">
              We use your data to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide personalized career assessments and recommendations</li>
              <li>Calculate your scores and generate insights</li>
              <li>Improve our assessment algorithms and recommendations</li>
              <li>Send you important account notifications</li>
              <li>Respond to your support requests</li>
            </ul>

            <p className="text-muted-foreground mt-4">
              <strong>We do NOT:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Sell your personal data to third parties</li>
              <li>Share your individual assessment results with employers or universities</li>
              <li>Use your data for targeted advertising</li>
              <li>Share your data with data brokers</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Eye className="h-6 w-6 text-orange-600" />
              4. Your Rights
            </h2>
            
            <p className="text-muted-foreground mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Access</strong> - Request a copy of all data we hold about you</li>
              <li><strong>Correction</strong> - Request correction of inaccurate data</li>
              <li><strong>Deletion</strong> - Request permanent deletion of your account and all associated data</li>
              <li><strong>Portability</strong> - Export your data in a machine-readable format</li>
              <li><strong>Withdraw consent</strong> - Withdraw consent for data processing at any time</li>
            </ul>

            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, please contact us at privacy@skillsphere.com.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Database className="h-6 w-6 text-gray-600" />
              5. Data Retention
            </h2>
            
            <p className="text-muted-foreground mb-4">
              We retain your data for as long as your account is active. If you delete your account:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your personal data is permanently deleted within 30 days</li>
              <li>Assessment responses and results are permanently deleted</li>
              <li>Anonymized, aggregated data may be retained for research purposes</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
            <p className="text-muted-foreground mb-4">
              We use essential cookies for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Authentication (keeping you logged in)</li>
              <li>Security (preventing CSRF attacks)</li>
              <li>Preferences (remembering your settings)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We use optional analytics cookies (with your consent) to understand how users 
              interact with our platform and improve our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any 
              significant changes by email or through a notice on our website. The "Last updated" 
              date at the top of this page indicates when the policy was last revised.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
              8. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <ul className="list-none mt-4 space-y-2 text-muted-foreground">
              <li><strong>Email:</strong> privacy@skillsphere.com</li>
              <li><strong>Address:</strong> SkillSphere, Inc.</li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary-600" />
              <span className="font-semibold">SkillSphere</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-primary-600">About</Link>
              <Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary-600">Terms of Service</Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SkillSphere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

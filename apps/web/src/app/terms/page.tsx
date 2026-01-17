import Link from 'next/link';
import { Brain, ArrowLeft, FileText, AlertTriangle, Scale, UserCheck, Ban, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TermsOfServicePage() {
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
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <Scale className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 17, 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <p className="lead text-lg text-muted-foreground">
            Welcome to SkillSphere. By using our services, you agree to these Terms of Service. 
            Please read them carefully.
          </p>

          <hr className="my-8" />

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <UserCheck className="h-6 w-6 text-green-600" />
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using SkillSphere ("the Service"), you agree to be bound by these 
              Terms of Service and our Privacy Policy. If you do not agree to these terms, 
              please do not use our Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              SkillSphere provides AI-powered career guidance through psychometric assessments. 
              Our services include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Personality assessments based on the Big Five model</li>
              <li>Career interest inventories based on Holland's RIASEC model</li>
              <li>Skills self-assessments</li>
              <li>Work values assessments</li>
              <li>AI-generated career recommendations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              3. Important Disclaimers
            </h2>
            
            <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-6 my-6">
              <h3 className="font-semibold text-amber-800 mb-3">Not Professional Advice</h3>
              <p className="text-amber-700">
                SkillSphere is NOT a substitute for professional career counseling, psychological 
                assessment, therapy, or medical advice. The information and recommendations provided 
                are for informational purposes only and should not be relied upon as the sole basis 
                for making career or life decisions.
              </p>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">3.1 No Guarantees</h3>
            <p className="text-muted-foreground">
              We do not guarantee that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Our recommendations will lead to career success</li>
              <li>Assessment results are 100% accurate</li>
              <li>Career matches will result in job offers</li>
              <li>Following our recommendations will lead to desired outcomes</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">3.2 Limitations of AI</h3>
            <p className="text-muted-foreground">
              Our AI-powered recommendations are based on statistical models and may not account 
              for your unique circumstances, local job market conditions, personal constraints, 
              or factors not captured by our assessments.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">3.3 Consult Professionals</h3>
            <p className="text-muted-foreground">
              We strongly recommend consulting with qualified career counselors, academic advisors, 
              or professionals before making significant career or educational decisions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. User Accounts</h2>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">4.1 Account Creation</h3>
            <p className="text-muted-foreground">
              To use certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Promptly update any changes to your information</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">4.2 Age Requirements</h3>
            <p className="text-muted-foreground">
              You must be at least 13 years old to use SkillSphere. Users under 18 should have 
              parental or guardian consent.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Ban className="h-6 w-6 text-red-600" />
              5. Prohibited Uses
            </h2>
            <p className="text-muted-foreground mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Scrape, copy, or harvest data from our platform</li>
              <li>Impersonate any person or entity</li>
              <li>Share your account credentials with others</li>
              <li>Use the Service to discriminate against individuals</li>
              <li>Misrepresent assessment results to third parties</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content, features, and functionality of SkillSphere, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Assessment questions and methodologies</li>
              <li>Scoring algorithms</li>
              <li>Career matching systems</li>
              <li>Website design and graphics</li>
              <li>Software code</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              are owned by SkillSphere and protected by copyright, trademark, and other intellectual 
              property laws.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">7. User Content</h2>
            <p className="text-muted-foreground">
              By submitting assessment responses, you grant us a non-exclusive, worldwide, 
              royalty-free license to use, process, and store your responses for the purpose of:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Generating your personalized results</li>
              <li>Improving our algorithms (using anonymized, aggregated data only)</li>
              <li>Conducting research (using anonymized data only)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                SkillSphere is provided "AS IS" and "AS AVAILABLE" without warranties of any kind
              </li>
              <li>
                We disclaim all warranties, express or implied, including merchantability and 
                fitness for a particular purpose
              </li>
              <li>
                We are not liable for any indirect, incidental, special, consequential, or 
                punitive damages
              </li>
              <li>
                Our total liability shall not exceed the amount you paid us in the past 12 months
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless SkillSphere, its officers, directors, 
              employees, and agents from any claims, damages, losses, or expenses arising from:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">10. Modifications to Service</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue any part of the Service 
              at any time without notice. We will not be liable to you or any third party for 
              any modification, suspension, or discontinuation of the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these Terms from time to time. We will notify you of material changes 
              by posting the new Terms on this page and updating the "Last updated" date. Your 
              continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your account and access to the Service immediately, 
              without prior notice or liability, for any reason, including breach of these Terms. 
              Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
              14. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-none mt-4 space-y-2 text-muted-foreground">
              <li><strong>Email:</strong> legal@skillsphere.com</li>
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

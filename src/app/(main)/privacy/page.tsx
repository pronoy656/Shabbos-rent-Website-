"use client";

import MainNavbar from "@/components/layout/MainNavbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 md:p-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">Privacy Policy</h1>
            <p className="text-zinc-500">Last Updated: October 24, 2024</p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-white prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-a:text-[#4c55a4] hover:prose-a:text-[#3d4484]">
            <h2>1. Introduction</h2>
            <p>
              Welcome to ShabbosRent. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2>2. The Data We Collect About You</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul>
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, and title.</li>
              <li><strong>Contact Data</strong> includes email address, billing address, delivery address, and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
              <li><strong>Profile Data</strong> includes your username and password, listings you have made, your interests, preferences, feedback and survey responses.</li>
            </ul>

            <h2>3. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., facilitating an apartment swap or rental).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2>5. Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data. You have the right to:
            </p>
            <ul>
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
            </ul>
            
            <p className="mt-8">
              If you have any questions about this privacy policy or our privacy practices, please contact us at <a href="mailto:privacy@shabbosrent.com">privacy@shabbosrent.com</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

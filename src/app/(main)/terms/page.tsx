"use client";

import MainNavbar from "@/components/layout/MainNavbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <MainNavbar />
      
      <main className="py-16 px-4">
        <div className="container mx-auto max-w-4xl bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-zinc-200 dark:border-zinc-800 p-8 md:p-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-12 border-b border-zinc-100 dark:border-zinc-800 pb-8">
            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">Terms of Service</h1>
            <p className="text-zinc-500">Last Updated: October 24, 2024</p>
          </div>

          <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-zinc-900 dark:prose-headings:text-white prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-a:text-[#4c55a4] hover:prose-a:text-[#3d4484]">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using ShabbosRent (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              ShabbosRent provides an online platform that connects hosts who have accommodations to rent or swap with guests seeking to rent or swap such accommodations, primarily catering to the Shabbat and Yom Tov observant community.
            </p>

            <h2>3. User Responsibilities & Conduct</h2>
            <p>
              You understand that you are solely responsible for compliance with any and all laws, rules, regulations, and tax obligations that may apply to your use of the Site, Application, Services and Collective Content. In connection with your use of the Site, Application and Services, you may not and you agree that you will not:
            </p>
            <ul>
              <li>Violate any local, state, provincial, national, or other law or regulation, or any order of a court.</li>
              <li>Use manual or automated software, devices, scripts, robots, backdoors or other means or processes to access, "scrape," "crawl" or "spider" any web pages or other services.</li>
              <li>Provide false or misleading information regarding your property's Kashrut or Shabbat observance status.</li>
              <li>Interfere with or damage our Site, Application or Services.</li>
            </ul>

            <h2>4. Accommodations and Financial Terms</h2>
            <p>
              If you are a Host and a booking is requested for your Accommodation via the Site, Application and Services, you will be required to either confirm or reject the booking request within the Booking Request Period. When a booking is requested, we will share with you (i) the first and last name of the Guest who has requested the booking, (ii) a link to the Guest's Account profile page, and (iii) an indication of whether or not the Guest has provided other information.
            </p>

            <h2>5. Disclaimers</h2>
            <p>
              If you choose to use the Site, Application, Services or Collective Content, you do so at your sole risk. You acknowledge and agree that ShabbosRent does not have an obligation to conduct background checks on any Member, including, but not limited to, Guests and Hosts, but may conduct such background checks in its sole discretion.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              You acknowledge and agree that, to the maximum extent permitted by law, the entire risk arising out of your access to and use of the Site, Application, Services and Collective Content, your listing or booking of any accommodations via the Site, Application and Services, and any contact you have with other users of ShabbosRent whether in person or online remains with you.
            </p>

            <p className="mt-8">
              If you have any questions about these Terms, please contact us at <a href="mailto:terms@shabbosrent.com">terms@shabbosrent.com</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

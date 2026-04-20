import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Moonshine Capital',
  description: 'Privacy Policy for Moonshine Capital Directory.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-neo-white min-h-screen text-neo-black py-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto bg-neo-cream border-4 border-neo-black p-8 md:p-12 shadow-brutal">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 border-b-4 border-neo-black pb-4">
          Privacy Policy
        </h1>

        <div className="space-y-6 font-medium text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you apply to be listed in our directory via our intake forms (e.g., Tally embeds) or communicate with us. This may include your name, email address, agency name, phone number, and professional details. We also collect automated usage data (such as IP addresses and click events) to improve our routing and analytics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">2. How We Use Your Information</h2>
            <p>
              We use the collected information to review directory applications, publish approved profiles, track engagement with our partners (e.g., CTA clicks), and improve the overall functionality of the Moonshine Capital platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">3. Information Sharing</h2>
            <p>
              When you interact with a partner listed in our directory (e.g., by clicking their CTA or applying through their link), we track this engagement. Depending on the partner&apos;s integration, some basic referral information may be shared to facilitate the connection. We do not sell your personal data to unauthorized third parties. However, your public directory profile will be visible to all site visitors.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">4. Third-Party Services</h2>
            <p>
              Our website uses third-party services like Tally for forms and various analytics tools. These services may have their own privacy policies governing the data they collect. Furthermore, linking to a third-party broker or lender means you are subject to their respective privacy practices once you leave our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold uppercase mb-2">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

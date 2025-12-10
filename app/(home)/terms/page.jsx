"use client";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-black mt-20">
      {/* TITLE */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
        <p className="text-gray-600 mt-2">
          Last updated: {new Date().getFullYear()}
        </p>
      </div>

      <div className="space-y-6 leading-relaxed">

        {/* INTRO */}
        <section>
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p className="mt-2">
            Welcome to our platform — a combined social media, business, and 
            content creation platform. By using our services, you agree to follow 
            all rules listed here. These terms apply to all users, including 
            creators, businesses, advertisers, and general users.
          </p>
        </section>

        {/* AGE REQUIREMENT */}
        <section>
          <h2 className="text-xl font-semibold">2. Age Requirement</h2>
          <p className="mt-2">
            You must be at least <span className="font-semibold">16 years old</span> 
            to use this platform. Users below this age may not create an account, 
            post content, or interact in any manner.
          </p>
        </section>

        {/* CONTENT POLICY */}
        <section>
          <h2 className="text-xl font-semibold">3. Content Rules & Restrictions</h2>
          <p className="mt-2">
            Our platform is designed for safe, respectful, and professional 
            communication. The following content is strictly prohibited:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Sexual content, nudity, pornography, sexually suggestive material</li>
            <li>Violence, abuse, physical harm, graphic or disturbing images</li>
            <li>Harassment, bullying, hate speech, racism, discrimination</li>
            <li>Threats, intimidation, or promotion of harmful behavior</li>
            <li>Drug use, weapons, illegal activities, exploitation</li>
            <li>Misleading, fake news, scams, phishing, or fraud</li>
            <li>Spam, automated posting, fake profiles, impersonation</li>
            <li>Extremist, political instability, or radical propaganda</li>
            <li>Unauthorized advertisements or misleading brand promotions</li>
          </ul>

          <p className="mt-3">
            Content that violates these rules may be removed, and your account 
            may be restricted or permanently banned.
          </p>
        </section>

        {/* USER-GENERATED CONTENT */}
        <section>
          <h2 className="text-xl font-semibold">4. User-Generated Content</h2>
          <p className="mt-2">
            Users are fully responsible for the content they upload. By posting 
            content on our platform, you confirm that:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>You own or have permission to use the content</li>
            <li>Your content does not violate copyrights or trademarks</li>
            <li>Your content follows community guidelines</li>
            <li>You grant us a license to display and distribute your content within the platform</li>
          </ul>
        </section>

        {/* CONTENT CREATOR RULES */}
        <section>
          <h2 className="text-xl font-semibold">5. Content Creator & Influencer Rules</h2>
          <p className="mt-2">
            If you publish content professionally or earn money through the 
            platform, you must follow these additional terms:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Sponsored posts must be clearly labeled as “Sponsored” or “Paid Partnership”</li>
            <li>No fake engagement (bot followers, likes, views)</li>
            <li>No misleading financial advice or dangerous challenges</li>
            <li>Creators must follow advertising laws of their region</li>
            <li>No unauthorized selling of user data or private communications</li>
          </ul>
        </section>

        {/* BUSINESS ACCOUNTS */}
        <section>
          <h2 className="text-xl font-semibold">6. Business & Brand Accounts</h2>
          <p className="mt-2">
            Businesses using the platform for marketing, selling products, or 
            providing services must follow:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Accuracy in product descriptions and offers</li>
            <li>No deceptive marketing or false claims</li>
            <li>No selling illegal, restricted, or harmful products</li>
            <li>Business communication must remain professional</li>
          </ul>
        </section>

        {/* ADVERTISING POLICY */}
        <section>
          <h2 className="text-xl font-semibold">7. Advertising & Promotional Content</h2>
          <p className="mt-2">
            Advertisers and brands must comply with:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Truth-in-advertising laws</li>
            <li>No misleading discounts or fake offers</li>
            <li>No adult, violent, or illegal product promotions</li>
            <li>Clear disclosure of paid promotions and sponsorships</li>
          </ul>
        </section>

        {/* SAFETY & REPORTING */}
        <section>
          <h2 className="text-xl font-semibold">8. Safety, Reporting & Moderation</h2>
          <p className="mt-2">
            Users can report harmful or inappropriate content. Our moderation 
            team may remove content or accounts that violate these terms. 
            We may also:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Warn users before action is taken</li>
            <li>Temporarily suspend accounts</li>
            <li>Permanently ban users for serious violations</li>
            <li>Cooperate with law enforcement when necessary</li>
          </ul>
        </section>

        {/* DATA USAGE */}
        <section>
          <h2 className="text-xl font-semibold">9. Data Collection & Analytics</h2>
          <p className="mt-2">
            We collect essential data to improve user experience, personalize 
            content, and ensure platform safety. Usage includes:
          </p>

          <ul className="list-disc pl-6 mt-3 space-y-1">
            <li>Basic profile information</li>
            <li>Activity data such as posts, likes, comments</li>
            <li>Business account analytics</li>
            <li>Creator performance metrics</li>
          </ul>
        </section>

        {/* ACCOUNT TERMINATION */}
        <section>
          <h2 className="text-xl font-semibold">10. Account Suspension & Termination</h2>
          <p className="mt-2">
            We reserve the right to suspend or permanently remove accounts 
            that violate any part of these Terms. No refunds will be issued 
            for paid features if termination occurs due to violations.
          </p>
        </section>

        {/* UPDATES */}
        <section>
          <h2 className="text-xl font-semibold">11. Updates to Terms</h2>
          <p className="mt-2">
            We may update these terms at any time. Continued use of the 
            platform means you accept the latest version.
          </p>
        </section>

        {/* CONTACT */}
        <section>
          <h2 className="text-xl font-semibold">12. Contact Us</h2>
          <p className="mt-2">
            For questions or complaints, contact us at:  
            <span className="font-semibold"> support@sosay.org </span>
          </p>
        </section>

      </div>
    </div>
  );
}

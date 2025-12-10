"use client";

export default function page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-black space-y-6 mt-20">
      <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
      <p className="text-center text-gray-600">
        Last Updated: {new Date().getFullYear()}
      </p>

      <section className="space-y-4">
        <p>
          Welcome to <strong>Sosay</strong>. We
          are committed to protecting your privacy and ensuring that your
          personal information is handled safely and responsibly. This Privacy Policy
          explains how we collect, use, store, and protect your information
          when you use our social media, business, and content creator platform.
        </p>

        <p>
          By using our app or website, you agree to the practices described in
          this policy.
        </p>
      </section>

      {/* ------------------- INFORMATION WE COLLECT ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>

        <h3 className="font-medium text-lg">1.1 Information You Provide</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Name, username, and date of birth</li>
          <li>Email address and phone number</li>
          <li>Profile details (bio, photo, interests)</li>
          <li>Posts, photos, videos, comments, messages</li>
          <li>Business details (if you create a business profile)</li>
          <li>Any content submitted through forms</li>
        </ul>

        <h3 className="font-medium text-lg">1.2 Automatically Collected Data</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Device type, operating system, and browser</li>
          <li>IP address and general location</li>
          <li>Usage patterns such as clicks, time spent, pages visited</li>
          <li>Cookies and analytics data</li>
        </ul>

        <h3 className="font-medium text-lg">1.3 Third-Party Information</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Social login information (Google, Facebook, etc.)</li>
          <li>Analytics and advertising partners</li>
          <li>Business verification or partner data (if applicable)</li>
        </ul>
      </section>

      {/* ------------------- HOW WE USE YOUR INFORMATION ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Create and manage your account</li>
          <li>Enable posting, messaging, following, and content creation</li>
          <li>Improve user experience and app performance</li>
          <li>Provide customer support</li>
          <li>Detect and prevent fraud or harmful activities</li>
          <li>Show personalized recommendations</li>
          <li>Ensure age compliance (16+)</li>
        </ul>

        <p className="font-medium">We do NOT sell your personal information.</p>
      </section>

      {/* ------------------- SAFETY ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Community & Safety Rules</h2>

        <p>To maintain a safe environment:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Users must be at least 16 years old.</li>
          <li>No posting of nudity, sexual content, or explicit material.</li>
          <li>No violence, harassment, threats, or hate speech.</li>
          <li>Violations may result in content removal or account suspension.</li>
        </ul>
      </section>

      {/* ------------------- SHARING ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. How We Share Your Information</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Service providers (hosting, analytics, email systems)</li>
          <li>Legal authorities when required</li>
          <li>Business partners with user permission</li>
          <li>Other users (public profile info, posts, etc.)</li>
        </ul>

        <p className="font-medium">
          Private messages and passwords are never shared.
        </p>
      </section>

      {/* ------------------- SECURITY ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Data Security</h2>

        <p>
          We use encryption, firewalls, and monitoring tools to protect your
          data. While we take strong security measures, no method of transmission
          is completely secure.
        </p>
      </section>

      {/* ------------------- RIGHTS ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Your Rights</h2>

        <p>You can:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Update your profile information</li>
          <li>Request account deletion</li>
          <li>Download your data</li>
          <li>Change privacy settings</li>
          <li>Contact our support at any time</li>
        </ul>
      </section>

      {/* ------------------- COOKIES ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Cookies & Tracking</h2>

        <p>
          We use cookies to improve performance, personalize your experience, and keep
          you logged in. You may disable cookies, but some features may not work
          properly.
        </p>
      </section>

      {/* ------------------- CHILDREN ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Children’s Privacy</h2>

        <p>
          Our platform is not intended for users under 16. We do not knowingly
          collect data from children. Accounts found to be underage will be
          removed.
        </p>
      </section>

      {/* ------------------- CHANGES ------------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">9. Changes to This Policy</h2>

        <p>
          We may update this Privacy Policy occasionally. Changes become
          effective when published.
        </p>
      </section>

      {/* ------------------- CONTACT ------------------- */}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">10. Contact Us</h2>

        <p>
          If you have questions about this Privacy Policy, please contact us:
        </p>

        <p>Email: <strong>support@sosay.org</strong></p>
        <p>Phone: <strong>+00 33666100010</strong></p>
      </section>
    </div>
  );
}

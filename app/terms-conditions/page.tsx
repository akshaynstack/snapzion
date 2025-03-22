import React from "react";
import Header from "@/components/Header";

const TermsAndConditions: React.FC = () => {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto text-white pt-6 md:pt-12 p-12">
        <h1 className="text-3xl font-bold mb-4 text-white">Terms and Conditions</h1>
        <p className="text-white mb-4">Last updated: March 2025</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            Welcome to our AI Image Generator SaaS application. By using our services, you agree to
            comply with these Terms and Conditions. If you do not agree, please do not use our
            services.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
          <ul className="list-disc list-inside">
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the security of your account and password.</li>
            <li>We reserve the right to suspend or terminate accounts that violate our policies.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Acceptable Use</h2>
          <ul className="list-disc list-inside">
            <li>Users must not generate illegal, harmful, or offensive content.</li>
            <li>Do not attempt to interfere with our services or security measures.</li>
            <li>Respect intellectual property rights when using our platform.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Payments and Subscriptions</h2>
          <p>
            If applicable, payments for premium features are processed securely through third-party
            payment providers. Subscription plans are billed on a recurring basis unless canceled.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to our services at any time, with or
            without notice, for violations of these terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
          <p>
            We are not responsible for any direct or indirect damages resulting from your use of our
            services. Use the platform at your own risk.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Changes to These Terms</h2>
          <p>
            We may update these Terms and Conditions from time to time. It is your responsibility to
            review them periodically for changes.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at
            support@vasarai.com.
          </p>
        </section>
      </div>
    </>
  );
};

export default TermsAndConditions;
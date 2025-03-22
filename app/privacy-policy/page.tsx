import React from "react";
import Header from "@/components/Header";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto text-white pt-6 md:pt-12 p-12">
      <h1 className="text-3xl font-bold mb-4 text-white">Privacy Policy</h1>
      <p className="text-white mb-4">Last updated: March 2025</p>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to our AI Image Generator SaaS application. We are committed to protecting your
          privacy. This Privacy Policy explains how we collect, use, and safeguard your information
          when you use our service.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <ul className="list-disc list-inside">
          <li>Personal Information: Name, email address, and payment details (if applicable).</li>
          <li>Usage Data: Interaction logs, preferences, and generated content metadata.</li>
          <li>Cookies & Tracking: We use cookies for analytics and user experience improvements.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
        <ul className="list-disc list-inside">
          <li>To provide and maintain our services.</li>
          <li>To improve user experience and optimize performance.</li>
          <li>For customer support and security measures.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. However, no method of
          transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
        <p>
          We may use third-party services (e.g., payment gateways, analytics tools) that have their
          own privacy policies. We recommend reviewing their policies for further information.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. User Rights</h2>
        <p>
          You have the right to access, modify, or delete your data. To request any changes, please
          contact us.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We encourage users to review this
          page periodically for any changes.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at support@vasarai.com.
        </p>
      </section>
    </div>
    </>
  );
};

export default PrivacyPolicy;
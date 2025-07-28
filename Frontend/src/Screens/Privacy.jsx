import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        Privacy Policy
      </h1>
      
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        <div className="prose prose-invert max-w-none">

          {/* Last Updated */}
          <div className="mb-8 text-center">
            <p className="text-gray-400 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">
              AceBoard ("we," "our," or "us") values your privacy and is committed to protecting your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              web-based interview preparation platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">1. Information We Collect</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <ul className="text-gray-300 space-y-3 list-disc list-inside">
                <li><strong className="text-purple-300">Personal Information:</strong> When you register or use AceBoard, we collect personal details such as your name, email address, password, profile information (skills, experience), and uploaded resumes.</li>
                <li><strong className="text-purple-300">Interview Data:</strong> Your mock interview responses, including text and audio (converted via Speech-to-Text), feedback, and performance analytics.</li>
                <li><strong className="text-purple-300">Usage Data:</strong> Information on how you interact with the platform, including login times, pages visited, and features used.</li>
                <li><strong className="text-purple-300">Cookies and Tracking:</strong> We may use cookies or similar technologies to enhance your user experience and analyze platform usage.</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">2. How We Use Your Information</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>To provide, operate, and maintain the AceBoard platform.</li>
                <li>To authenticate users securely and manage access control.</li>
                <li>To generate personalized interview questions and provide feedback.</li>
                <li>To analyze performance trends and improve platform features.</li>
                <li>To communicate important updates, notifications, and support.</li>
                <li>To comply with legal obligations and protect our rights.</li>
              </ul>
            </div>
          </section>

          {/* Information Sharing and Disclosure */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">3. Information Sharing and Disclosure</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell or rent your personal information to third parties. We may share your data with:
              </p>
              <ul className="text-gray-300 space-y-3 list-disc list-inside">
                <li><strong className="text-purple-300">Service Providers:</strong> Trusted third-party vendors who help us operate and improve the platform (e.g., cloud hosting, analytics services).</li>
                <li><strong className="text-purple-300">Legal Requirements:</strong> When required by law or to respond to lawful requests by public authorities.</li>
                <li><strong className="text-purple-300">With Your Consent:</strong> When you explicitly agree to share your information.</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">4. Data Security</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against 
                unauthorized access, loss, misuse, or alteration. This includes encrypted passwords, secure connections 
                (HTTPS), and restricted access controls.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">5. Data Retention</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed">
                We retain your personal information and interview data only as long as necessary to provide our services, 
                comply with legal obligations, or resolve disputes.
              </p>
            </div>
          </section>

          {/* Your Rights and Choices */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">6. Your Rights and Choices</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <ul className="text-gray-300 space-y-2 list-disc list-inside">
                <li>You can access, update, or delete your personal information through your account settings.</li>
                {/* <li>You may opt out of receiving promotional emails by following unsubscribe instructions.</li> */}
                <li>You have the right to request information about the data we hold about you.</li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">7. Children's Privacy</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed">
                AceBoard is not intended for children under the age of 13. We do not knowingly collect personal 
                information from children under 13.
              </p>
            </div>
          </section>

          {/* Changes to This Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">8. Changes to This Privacy Policy</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                by posting the new policy on the platform and updating the effective date.
              </p>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">9. Contact Us</h2>
            <div className="bg-gray-700 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <p className="text-purple-300">
                <strong>Email:</strong> hello.aceboard@gmail.com
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

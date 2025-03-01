import React from "react";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Frequently Asked Questions
      </h1>
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        {/* Question 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-2">How do I get started?</h2>
          <p className="text-gray-300">
            To get started, simply sign up for an account on AceBoard. Once registered, you can explore our features, such as mock interviews, resume integration, and performance analytics.
          </p>
        </div>

        {/* Question 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-2">How do I contact support?</h2>
          <p className="text-gray-300">
            You can reach out to our support team at{" "}
            <a href="mailto:support@aceboard.com" className="text-purple-400 hover:underline">
              support@aceboard.com
            </a>
            . We typically respond within 24 hours.
          </p>
        </div>

        {/* Question 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-2">Can I use AceBoard on mobile?</h2>
          <p className="text-gray-300">
            Yes, AceBoard is fully responsive and works seamlessly on both desktop and mobile devices. You can practice mock interviews and track your progress on the go.
          </p>
        </div>

        {/* Question 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-2">How does the AI-generated feedback work?</h2>
          <p className="text-gray-300">
            Our AI analyzes your responses during mock interviews and provides real-time feedback on your fluency, clarity, and confidence. It also suggests areas for improvement based on industry standards.
          </p>
        </div>

        {/* Question 5 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-2">What types of interviews does AceBoard support?</h2>
          <p className="text-gray-300">
            AceBoard supports a wide range of interview types, including technical, behavioral, and case interviews. You can customize the interview settings based on your job role and difficulty level.
          </p>
        </div>

        {/* Question 6 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-2">Can I share my progress with others?</h2>
          <p className="text-gray-300">
            Yes, you can share your progress and interview recordings with mentors, friends, or colleagues for additional feedback and guidance.
          </p>
        </div>

        {/* Question 7 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-2">How secure is my data on AceBoard?</h2>
          <p className="text-gray-300">
            Your data is encrypted and stored securely. We follow industry-standard security practices to ensure your information is safe and private.
          </p>
        </div>

        {/* Question 8 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-2">What if I encounter technical issues?</h2>
          <p className="text-gray-300">
            If you experience any technical issues, please contact our support team at{" "}
            <a href="mailto:support@aceboard.com" className="text-purple-400 hover:underline">
              support@aceboard.com
            </a>
            . We’ll assist you in resolving the issue as quickly as possible.
          </p>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
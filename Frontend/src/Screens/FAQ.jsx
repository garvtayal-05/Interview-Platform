import React, { useState } from "react";

const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // FAQ data
  const faqItems = [
    {
      question: "How do I get started?",
      answer: "To get started, simply sign up for an account on AceBoard. Once registered, you can explore our features, such as mock interviews, resume integration, and performance analytics."
    },
    {
      question: "How do I contact support?",
      answer: "You can reach out to our support team at hello.aceboard@gmail.com. We typically respond within 24 hours."
    },
    // {
    //   question: "Can I use AceBoard on mobile?",
    //   answer: "Yes, AceBoard is fully responsive and works seamlessly on both desktop and mobile devices. You can practice mock interviews and track your progress on the go."
    // },
    {
      question: "How does the AI-generated feedback work?",
      answer: "Our AI analyzes your responses during mock interviews and provides real-time feedback on your fluency, clarity, and confidence. It also suggests areas for improvement based on industry standards."
    },
    {
      question: "What types of interviews does AceBoard support?",
      answer: "AceBoard supports a wide range of interview types, including technical, behavioral, and case interviews. You can customize the interview settings based on your job role and difficulty level."
    },
    {
      question: "Can I share my progress with others?",
      answer: "Yes, you can share your progress and interview recordings with mentors, friends, or colleagues for additional feedback and guidance."
    },
    {
      question: "How secure is my data on AceBoard?",
      answer: "Your data is encrypted and stored securely. We follow industry-standard security practices to ensure your information is safe and private."
    },
    {
      question: "What if I encounter technical issues?",
      answer: "If you experience any technical issues, please contact our support team at hello.aceboard@gmail.com. We'll assist you in resolving the issue as quickly as possible."
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        Frequently Asked Questions
      </h1>
      
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        {faqItems.map((item, index) => (
          <div key={index} className="mb-6 border-b border-gray-700 last:border-0 pb-6 last:pb-0">
            <button
              onClick={() => toggleExpand(index)}
              className="w-full text-left flex justify-between items-center"
            >
              <h2 className="text-xl font-semibold text-purple-400 mb-2">{item.question}</h2>
              <span className="text-purple-400 ml-4">
                {expandedIndex === index ? '−' : '+'}
              </span>
            </button>
            
            {expandedIndex === index && (
              <p className="text-gray-300 text-lg leading-relaxed mt-4">
                {item.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Contact section */}
      <div className="max-w-4xl mx-auto mt-12 bg-gray-800 p-8 rounded-lg shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">Still have questions?</h2>
        <p className="text-gray-300 text-lg mb-6">
          Contact us at: <span className="text-purple-300">hello.aceboard@gmail.com</span>
        </p>
      </div>
    </div>
  );
};

export default FAQ;

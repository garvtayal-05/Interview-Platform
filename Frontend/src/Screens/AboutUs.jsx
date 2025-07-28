import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
        About Us
      </h1>
      
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Welcome to AceBoard</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Your AI-powered interview preparation platform. We help job seekers prepare for interviews 
            and land their dream jobs with confidence.
          </p>
        </section>

        {/* Mission */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            To empower job seekers with the tools and confidence they need to ace their interviews. 
            We believe everyone deserves the opportunity to showcase their skills.
          </p>
        </section>

        {/* Vision */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Vision</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            To make job interviews less stressful and more successful by leveraging AI technology 
            to revolutionize interview preparation.
          </p>
        </section>

        {/* What We Offer */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">What We Offer</h2>
          <ul className="text-gray-300 text-lg space-y-3 list-disc list-inside">
            <li>AI-powered interview practice sessions</li>
            <li>Personalized feedback and suggestions</li>
            <li>Job matching and recommendations</li>
            <li>Interview experience sharing platform</li>
            <li>Community support and networking</li>
          </ul>
        </section>

        {/* Our Team */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Team</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            We are a team of passionate developers, career coaches, and AI enthusiasts 
            dedicated to helping you succeed in your career journey.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Get in Touch</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Have questions or feedback? We'd love to hear from you at{" "}
            <span className="text-purple-300">hello.aceboard@gmail.com</span>
          </p>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;

import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        About Us
      </h1>
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Who We Are</h2>
          <p className="text-gray-300 text-lg">
            Welcome to <span className="text-purple-400 font-semibold">AceBoard</span>, your ultimate AI-powered interview preparation platform. We are a team of passionate developers, career coaches, and AI enthusiasts dedicated to helping you succeed in your job interviews.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Mission</h2>
          <p className="text-gray-300 text-lg">
            Our mission is to empower job seekers with the tools and confidence they need to ace their interviews. We believe that everyone deserves the opportunity to showcase their skills and land their dream job.
          </p>
        </div>

        {/* Vision */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Vision</h2>
          <p className="text-gray-300 text-lg">
            We envision a world where job interviews are no longer a source of stress but an opportunity to shine. By leveraging cutting-edge AI technology, we aim to revolutionize the way people prepare for interviews.
          </p>
        </div>

        {/* Values */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-300 text-lg">
            <li className="mb-2">
              <span className="text-purple-400 font-semibold">Innovation:</span> We constantly innovate to provide the best tools for interview preparation.
            </li>
            <li className="mb-2">
              <span className="text-purple-400 font-semibold">Empathy:</span> We understand the challenges job seekers face and strive to make their journey easier.
            </li>
            <li className="mb-2">
              <span className="text-purple-400 font-semibold">Excellence:</span> We are committed to delivering high-quality, reliable, and user-friendly solutions.
            </li>
            <li className="mb-2">
              <span className="text-purple-400 font-semibold">Community:</span> We believe in building a supportive community where users can learn and grow together.
            </li>
          </ul>
        </div>

        {/* Team */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Meet Our Team</h2>
          <p className="text-gray-300 text-lg">
            Our team is made up of talented individuals who are passionate about technology and career development. From AI engineers to UX designers, we work together to create a seamless and effective platform for our users.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Join Us on This Journey</h2>
          <p className="text-gray-300 text-lg mb-6">
            Whether you're a job seeker, a career coach, or an employer, we invite you to join us in transforming the interview preparation process. Together, we can make interviews less stressful and more successful.
          </p>
          <a
            href="/signup"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
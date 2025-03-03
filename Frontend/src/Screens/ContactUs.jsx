import React, { useState } from "react";

const ContactUs = () => {
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    message: ""
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulating form submission
    setFormStatus({
      submitted: true,
      message: "Thank you for your message! We'll get back to you shortly."
    });
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" });
      setFormStatus({ submitted: false, message: "" });
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Contact Us
      </h1>
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        {/* Contact Information */}
        <div className="mb-8 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-purple-400 mb-4">Get in Touch</h2>
            <p className="text-gray-300 text-lg mb-4">
              We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-lg">
                    <span className="text-purple-400 font-semibold">Email:</span>{" "}
                    <a href="mailto:support@aceboard.com" className="hover:underline">
                      support@aceboard.com
                    </a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-lg">
                    <span className="text-purple-400 font-semibold">Phone:</span> +1 (123) 456-7890
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 flex items-center justify-center bg-purple-500 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-300 text-lg">
                    <span className="text-purple-400 font-semibold">Address:</span> 123 Interview Lane, Suite 456, Tech City, TC 78901
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="h-full bg-gray-700 rounded-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-400 mb-4">Our Office Hours</h3>
                <div className="space-y-2">
                  <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-300">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-gray-300">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Send Us a Message</h2>
          
          {formStatus.submitted ? (
            <div className="bg-purple-500 bg-opacity-20 border border-purple-500 rounded-lg p-4 mb-6">
              <p className="text-lg text-white">{formStatus.message}</p>
            </div>
          ) : null}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 text-lg mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 text-lg mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 text-lg mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                placeholder="Enter your message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <span>Send Message</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </form>
        </div>

        {/* Social Media Links */}
        <div>
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Follow Us</h2>
          <p className="text-gray-300 text-lg mb-4">
            Stay connected with us on social media for the latest updates, tips, and resources.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://twitter.com/aceboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/aceboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a
              href="https://facebook.com/aceboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href="https://instagram.com/aceboard"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-12 p-6 bg-gray-700 rounded-lg">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="/faq#getting-started" className="p-3 bg-gray-800 rounded hover:bg-gray-600 transition duration-300">
              How do I get started?
            </a>
            <a href="/faq#mobile" className="p-3 bg-gray-800 rounded hover:bg-gray-600 transition duration-300">
              Can I use AceBoard on mobile?
            </a>
            <a href="/faq#feedback" className="p-3 bg-gray-800 rounded hover:bg-gray-600 transition duration-300">
              How does the AI-generated feedback work?
            </a>
            <a href="/faq#security" className="p-3 bg-gray-800 rounded hover:bg-gray-600 transition duration-300">
              How secure is my data on AceBoard?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
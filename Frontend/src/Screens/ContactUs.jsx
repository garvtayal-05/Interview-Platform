import React from "react";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 animate-slide-in-down">
        Contact Us
      </h1>
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-2xl">
        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Get in Touch</h2>
          <p className="text-gray-300 text-lg mb-4">
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us.
          </p>
          <div className="space-y-4">
            <p className="text-gray-300 text-lg">
              <span className="text-purple-400 font-semibold">Email:</span>{" "}
              <a href="mailto:support@aceboard.com" className="hover:underline">
                support@aceboard.com
              </a>
            </p>
            <p className="text-gray-300 text-lg">
              <span className="text-purple-400 font-semibold">Phone:</span> +1 (123) 456-7890
            </p>
            <p className="text-gray-300 text-lg">
              <span className="text-purple-400 font-semibold">Address:</span> 123 Interview Lane, Suite 456, Tech City, TC 78901
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Send Us a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-lg mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 text-lg mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Send Message
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
              className="text-purple-400 hover:text-purple-300 transition duration-300"
            >
              <i className="fab fa-twitter text-3xl"></i>
            </a>
            <a
              href="https://linkedin.com/company/aceboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition duration-300"
            >
              <i className="fab fa-linkedin text-3xl"></i>
            </a>
            <a
              href="https://facebook.com/aceboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition duration-300"
            >
              <i className="fab fa-facebook text-3xl"></i>
            </a>
            <a
              href="https://instagram.com/aceboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition duration-300"
            >
              <i className="fab fa-instagram text-3xl"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
import React, { useState, useEffect } from "react";

const UnderDevelopment = () => {
  const [progress, setProgress] = useState(15);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Simulate progress increasing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newValue = prev + Math.random() * 0.5;
        return newValue > 95 ? 95 : newValue;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle mouse movement for the particle effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const features = [
    { icon: "🚀", text: "Fast" },
    { icon: "🎨", text: "Modern" },
    { icon: "🔒", text: "Secure" },
    { icon: "📱", text: "Responsive" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-8 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <h1 className="text-2xl font-bold text-white">Under Development</h1>
            <p className="text-purple-200 mt-1">Great things are brewing!</p>
          </div>
          
          <div className="p-6">
            {/* Main content container */}
            <div className="relative z-10 p-8 rounded-xl border border-gray-700 shadow-lg mb-8 flex flex-col md:flex-row">
              {/* Light effect that follows cursor */}
              <div 
                className="absolute pointer-events-none bg-indigo-500 opacity-10 rounded-full blur-xl"
                style={{
                  width: 300,
                  height: 300,
                  left: cursorPosition.x - 150,
                  top: cursorPosition.y - 150,
                  transition: 'left 0.2s, top 0.2s'
                }}
              />
              
              {/* Text content column */}
              <div className="flex-1 mb-6 md:mb-0">
                {/* Main Heading */}
                <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  Development in Progress
                </h2>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className="text-lg text-gray-400">Development: {progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-1000 relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
                    </div>
                  </div>
                </div>

                <p className="text-gray-300">
                  Our team is working diligently to complete this feature. We appreciate your patience as we build something amazing for you.
                </p>
              </div>
              
              {/* Right side with emojis */}
              <div className="pl-0 md:pl-8 md:border-l md:border-gray-700 flex flex-col justify-center">
                <h3 className="text-xl font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                  Coming Soon
                </h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <span className="mr-3 text-2xl">{feature.icon}</span>
                      <span className="text-lg text-gray-300">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline section
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Development Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Planning Phase</h4>
                    <p className="text-gray-400">Requirements gathering and feature planning</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Design Phase</h4>
                    <p className="text-gray-400">UI/UX design and prototyping</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    ⚙️
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Development Phase</h4>
                    <p className="text-gray-400">Currently in active development</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    🧪
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Testing Phase</h4>
                    <p className="text-gray-400">Quality assurance and bug fixes</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    🚀
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white">Deployment</h4>
                    <p className="text-gray-400">Release and launch</p>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      
      {/* Add these animation keyframes to your CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default UnderDevelopment;
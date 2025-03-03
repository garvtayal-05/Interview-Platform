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
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-indigo-500 opacity-10 rounded-full"
            style={{
              width: Math.random() * 400 + 100, // Increased size
              height: Math.random() * 400 + 100, // Increased size
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 50 + 30}s`,
              animationDelay: `${-Math.random() * 20}s`,
              transform: 'scale(0)',
              animation: 'float infinite ease-in-out'
            }}
          />
        ))}
      </div>
      
      {/* Light effect that follows cursor */}
      <div 
        className="absolute pointer-events-none bg-indigo-500 opacity-10 rounded-full blur-xl"
        style={{
          width: 400, // Increased from 300
          height: 400, // Increased from 300
          left: cursorPosition.x - 200,
          top: cursorPosition.y - 200,
          transition: 'left 0.2s, top 0.2s'
        }}
      />
      
      {/* Main content container - larger size */}
      <div className="relative z-10 bg-gray-900 bg-opacity-40 backdrop-blur-md p-8 rounded-xl border border-gray-700 shadow-2xl w-full max-w-3xl mx-4 flex"> {/* Increased padding and max-width */}
        {/* Text content column */}
        <div className="flex-1">
          {/* Main Heading */}
          <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 animate-gradient"> {/* Increased text size and margin */}
            Under Development
          </h1>
          
          {/* Subheading + Message combined */}
          <p className="text-2xl text-gray-300 mb-6"> {/* Increased text size and margin */}
            Great things are brewing!
          </p>
          
          {/* Progress Bar */}
          <div className="mb-6"> {/* Increased margin */}
            <div className="flex items-center mb-2"> {/* Increased margin */}
              <span className="text-lg text-gray-400">Development: {progress.toFixed(1)}%</span> {/* Increased text size */}
            </div>
            <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden shadow-inner"> {/* Increased height */}
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-1000 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side with emojis */}
        <div className="pl-8 border-l border-gray-700 flex flex-col justify-center"> {/* Increased padding */}
          <div className="text-4xl space-y-4"> {/* Increased text size and spacing */}
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-3">{feature.icon}</span> {/* Increased margin */}
                <span className="text-lg text-gray-300">{feature.text}</span> {/* Increased text size */}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Add these animation keyframes to your CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); } /* Increased movement */
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
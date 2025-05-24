
import React from 'react';

interface AnimatedBackgroundProps {
  variant: 'student' | 'teacher';
  children: React.ReactNode;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant, children }) => {
  const studentColors = [
    'bg-blue-100/50',
    'bg-indigo-100/50',
    'bg-purple-100/50',
    'bg-cyan-100/50'
  ];

  const teacherColors = [
    'bg-orange-100/50',
    'bg-yellow-100/50',
    'bg-red-100/50',
    'bg-pink-100/50'
  ];

  const colors = variant === 'student' ? studentColors : teacherColors;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated floating shapes */}
      <div className="absolute inset-0 -z-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${colors[i % colors.length]} animate-float`}
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className={`absolute inset-0 -z-5 ${
        variant === 'student' 
          ? 'bg-gradient-to-br from-blue-50/30 to-indigo-50/30' 
          : 'bg-gradient-to-br from-orange-50/30 to-yellow-50/30'
      }`} />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

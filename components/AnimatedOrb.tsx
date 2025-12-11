'use client';

export interface AnimatedOrbProps {
  isActive?: boolean;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedOrb({
  isActive = false,
  isSpeaking = false,
  size = 'md',
}: AnimatedOrbProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  };

  const ringClasses = {
    sm: 'w-20 h-20',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  };

  return (
    <div className="flex items-center justify-center">
      {/* Outer pulsing ring */}
      {isActive && (
        <div
          className={`${ringClasses[size]} absolute rounded-full border-2 border-blue-400 opacity-30 animate-pulse`}
          style={{
            animation: isSpeaking ? 'pulse-ring 1s ease-out infinite' : 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Middle ring */}
      {isActive && (
        <div
          className={`${ringClasses[size]} absolute rounded-full border border-blue-300 opacity-20`}
          style={{
            animation: isSpeaking ? 'pulse-ring 1.5s ease-out infinite 0.3s' : 'pulse 2.5s ease-in-out infinite',
          }}
        />
      )}

      {/* Main orb */}
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden shadow-2xl`}
        style={{
          background: isActive
            ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
            : 'linear-gradient(135deg, #6b7280 0%, #374151 100%)',
          transition: 'background 0.3s ease-in-out',
        }}
      >
        {/* Inner gradient and shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-transparent to-transparent opacity-40" />

        {/* Animated highlight */}
        <div
          className={`absolute w-1/3 h-1/3 bg-white rounded-full opacity-30 ${
            isSpeaking ? 'animate-bounce' : ''
          }`}
          style={{
            top: '10%',
            left: '10%',
            animation: isSpeaking ? 'bounce 0.6s ease-in-out infinite' : 'none',
          }}
        />

        {/* Center pulse when speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                animation: 'scale-pulse 0.8s ease-out infinite',
              }}
            />
          </div>
        )}

        {/* Status indicator dot */}
        <div className="absolute bottom-4 right-4 flex gap-1">
          <div
            className={`w-2 h-2 rounded-full ${
              isActive ? 'bg-green-300 animate-pulse' : 'bg-gray-400'
            }`}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes scale-pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.4;
          }
          50% {
            transform: scale(1);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}

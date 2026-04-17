import React from 'react';

const LoadingScreen = ({ isFadingOut }) => {
  return (
    <div className={`loading-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="ambient-glow" />

      <div className="loading-content relative z-10 glass-panel">
        <div className="loading-core-wrapper">
          
          {/* Engineering core visualization */}
          <div className="loading-engine-box">
            {/* Outer rotating dashed ring */}
            <div className="custom-ring dashed-ring" />
            
            {/* Inner counter-rotating ring (Copper/Orange) */}
            <div className="custom-ring solid-ring" />
            
            {/* Central Hexagon Core (Green/Copper Mix) */}
            <div className="hex-core">
              <img src="/logo.webp" alt="Engineering Core" className="core-logo-img" />
            </div>

            {/* Orbiting particles */}
            <div className="orbit-particle" />
          </div>
          
          <h1 className="main-logo-title">
            PCB Design Hub
          </h1>
          
          <div className="loading-subtitle-wrapper">
            <div className="loading-subtitle">
               Footprints • Stackup • Layout • Standards
            </div>
          </div>
          
        </div>
      </div>

      <style>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: var(--bg-primary);
          background-image: 
            radial-gradient(var(--border-light) 1px, transparent 1px),
            radial-gradient(var(--border-light) 1px, transparent 1px);
          background-size: 30px 30px;
          background-position: 0 0, 15px 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.8s, backdrop-filter 0.8s, background-color 0.3s;
        }

        .loading-screen::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, var(--bg-primary) 100%);
          z-index: 0;
        }

        .ambient-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: var(--accent-primary);
          opacity: 0.1;
          border-radius: 50%;
          filter: blur(100px);
          animation: pulseAmbient 4s ease-in-out infinite alternate;
        }

        .loading-screen.fade-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          backdrop-filter: blur(0px);
        }

        .glass-panel {
          padding: 3rem 4rem;
          background: var(--bg-secondary);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-glass);
          border-radius: 2rem;
          animation: scaleUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .loading-core-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .loading-engine-box {
          position: relative;
          margin-bottom: 2.5rem;
          width: 8rem;
          height: 8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .custom-ring {
          position: absolute;
          border-radius: 50%;
        }

        .dashed-ring {
          inset: 0;
          border: 1px dashed var(--accent-primary);
          opacity: 0.4;
          animation: spinRight 8s linear infinite;
        }

        .solid-ring {
          inset: 0.75rem;
          border: 2px solid var(--accent-secondary);
          opacity: 0.5;
          animation: spinLeft 4s linear infinite;
        }

        .hex-core {
          position: relative;
          width: 4rem;
          height: 4rem;
          background: linear-gradient(135deg, rgba(26, 107, 58, 0.2), rgba(200, 117, 51, 0.2));
          border-radius: 1rem;
          border: 1px solid rgba(26, 107, 58, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(26, 107, 58, 0.3);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .core-icon {
          color: var(--accent-primary);
          animation: pulseAmbient 2s ease-in-out infinite alternate;
        }

        .orbit-particle {
          position: absolute;
          top: 0;
          left: 50%;
          width: 0.5rem;
          height: 0.5rem;
          background: var(--accent-secondary);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px var(--accent-secondary);
          animation: pingParticle 2s cubic-bezier(0,0,0.2,1) infinite;
        }

        .main-logo-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 900;
          color: var(--accent-primary);
          letter-spacing: -0.05em;
          text-transform: uppercase;
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }

        .loading-subtitle-wrapper {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }

        .loading-subtitle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 900;
          color: var(--accent-secondary);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          opacity: 0.9;
        }

        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes spinRight {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spinLeft {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes pulseAmbient {
          0% { opacity: 0.5; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes pingParticle {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          75%, 100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }

      `}</style>
    </div>
  );
};

export default LoadingScreen;

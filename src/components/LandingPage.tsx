import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Camera, Scan, Mic } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 cyber-text-glow">
          <span className="glitch-effect">SPOT THE IMPOSTER</span>
        </h1>
        <h2 className="text-2xl md:text-3xl cyber-text-glow-pink mb-8">
          Deepfake Detection in Real-Time
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-12">
          Our advanced AI technology can detect manipulated media with unprecedented accuracy.
          Upload your file, use your webcam, or analyze audio to scan for deepfakes instantly.
        </p>
      </div>

      <div className="portal-scanner mb-16 animate-pulse-slow">
        <div className="scanner-beam"></div>
        <Scan className="text-cyber-blue w-16 h-16 animate-pulse" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-wrap justify-center">
        <button 
          onClick={() => navigate('/upload')}
          className="cyber-button group flex items-center justify-center gap-3"
        >
          <Upload className="w-5 h-5 transition-transform group-hover:scale-110" />
          Upload File
        </button>
        
        <button 
          onClick={() => navigate('/webcam')}
          className="cyber-button-alt group flex items-center justify-center gap-3"
        >
          <Camera className="w-5 h-5 transition-transform group-hover:scale-110" />
          Use Webcam
        </button>
        
        <button 
          onClick={() => navigate('/audio')}
          className="cyber-button-purple group flex items-center justify-center gap-3"
        >
          <Mic className="w-5 h-5 transition-transform group-hover:scale-110" />
          Analyze Audio
        </button>
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={() => navigate('/education')}
          className="text-gray-400 hover:text-cyber-blue transition-colors underline text-sm"
        >
          Learn how deepfake detection works
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
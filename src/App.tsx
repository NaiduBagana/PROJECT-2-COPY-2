import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UploadInterface from './components/UploadInterface';
import WebcamInterface from './components/WebcamInterface';
import AudioInterface from './components/AudioInterface';
import AnalysisScreen from './components/AnalysisScreen';
import ResultDisplay from './components/ResultDisplay';
import EducationalSection from './components/EducationalSection';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cyber-black relative overflow-hidden">
        <div className="bg-cyber-grid bg-cyber-grid fixed inset-0 opacity-20"></div>
        <MatrixBackground />
        <Particles />
        
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadInterface />} />
            <Route path="/webcam" element={<WebcamInterface />} />
            <Route path="/audio" element={<AudioInterface />} />
            <Route path="/analysis" element={<AnalysisScreen />} />
            <Route path="/result" element={<ResultDisplay />} />
            <Route path="/education" element={<EducationalSection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Matrix background effect
const MatrixBackground = () => {
  const [columns, setColumns] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const columnCount = Math.floor(window.innerWidth / 20);
    const newColumns = [];

    for (let i = 0; i < columnCount; i++) {
      const columnLength = 10 + Math.floor(Math.random() * 20);
      let columnContent = '';
      
      for (let j = 0; j < columnLength; j++) {
        columnContent += chars[Math.floor(Math.random() * chars.length)];
      }
      
      const style = {
        left: `${i * 20}px`,
        animationDuration: `${15 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 5}s`,
        fontSize: `${Math.random() > 0.5 ? '1rem' : '0.8rem'}`
      };
      
      newColumns.push(
        <div key={i} className="matrix-column" style={style}>
          {columnContent}
        </div>
      );
    }
    
    setColumns(newColumns);
  }, []);

  return <div className="matrix-container">{columns}</div>;
};

// Particle animation
const Particles = () => {
  const [particles, setParticles] = React.useState<React.ReactNode[]>([]);

  React.useEffect(() => {
    const particleCount = 50;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const size = 2 + Math.random() * 5;
      const style = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0.1 + Math.random() * 0.5,
        animationDuration: `${5 + Math.random() * 10}s`,
        animationDelay: `${Math.random() * 5}s`
      };
      
      newParticles.push(
        <div 
          key={i} 
          className="particle animate-float" 
          style={style}
        />
      );
    }
    
    setParticles(newParticles);
  }, []);

  return <div className="particles">{particles}</div>;
};

export default App;
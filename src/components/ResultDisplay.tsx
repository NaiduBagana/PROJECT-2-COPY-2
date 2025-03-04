import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Share2, Info, Download, ArrowLeft, Volume2, VolumeX } from 'lucide-react';

interface SuspiciousArea {
  x: number;
  y: number;
  radius: number;
  intensity: number;
}

interface LocationState {
  isFake: boolean;
  fileType: 'image' | 'video' | 'audio';
  preview: string;
  confidence: number;
  suspiciousAreas: SuspiciousArea[];
  isAudio?: boolean;
}

const ResultDisplay: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isFake, fileType, preview, confidence, suspiciousAreas, isAudio } = location.state as LocationState;
  
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alertSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Play sound effect based on result
  useEffect(() => {
    if (!soundPlayed) {
      if (isFake && alertSoundRef.current) {
        alertSoundRef.current.volume = 0.5;
        alertSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
      } else if (!isFake && successSoundRef.current) {
        successSoundRef.current.volume = 0.5;
        successSoundRef.current.play().catch(e => console.error("Error playing sound:", e));
      }
      setSoundPlayed(true);
    }
  }, [isFake, soundPlayed]);
  
  // Toggle mute for all sounds
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (alertSoundRef.current) {
      alertSoundRef.current.muted = !isMuted;
    }
    
    if (successSoundRef.current) {
      successSoundRef.current.muted = !isMuted;
    }
    
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className={`${isFake ? 'cyber-panel-alt' : 'cyber-panel'} max-w-4xl w-full`}>
        <div className="text-center mb-8">
          {isFake ? (
            <div className="animate-glitch">
              <h1 className="text-4xl font-bold mb-2 text-cyber-red">
                WARNING: DEEPFAKE DETECTED
              </h1>
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-6 h-6 text-cyber-red animate-pulse" />
                <p className="text-xl text-cyber-red">
                  This {fileType} has been artificially manipulated
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold mb-2 cyber-text-glow">
                AUTHENTIC {fileType.toUpperCase()} VERIFIED
              </h1>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-cyber-green" />
                <p className="text-xl text-cyber-green">
                  No signs of manipulation detected
                </p>
              </div>
            </div>
          )}
          
          <button 
            onClick={toggleMute}
            className="absolute top-4 right-4 p-2 rounded-full bg-cyber-dark hover:bg-cyber-dark/70 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-gray-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-cyber-blue" />
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative">
            <div className={isFake ? "cracked-mirror" : "digital-mirror"}>
              {fileType === 'image' ? (
                <div className="relative">
                  <img 
                    src={preview} 
                    alt="Result" 
                    className="w-full"
                  />
                  {isFake && showHeatmap && (
                    <HeatmapOverlay areas={suspiciousAreas} />
                  )}
                </div>
              ) : fileType === 'video' ? (
                <div className="relative">
                  <video 
                    src={preview} 
                    controls
                    className="w-full"
                    ref={audioRef}
                  />
                  {isFake && showHeatmap && (
                    <HeatmapOverlay areas={suspiciousAreas} />
                  )}
                </div>
              ) : (
                <div className="w-full h-full min-h-[200px] bg-cyber-dark flex items-center justify-center p-4">
                  <audio 
                    src={preview} 
                    controls
                    className="w-full"
                    ref={audioRef}
                  />
                  <AudioWaveform isFake={isFake} />
                </div>
              )}
              
              {isFake && fileType !== 'audio' && <div className="crack-overlay"></div>}
            </div>
            
            {isFake && fileType !== 'audio' && (
              <div className="mt-4 flex justify-between">
                <button 
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className="text-sm text-cyber-pink hover:text-white transition-colors flex items-center gap-1"
                >
                  <Info className="w-4 h-4" />
                  {showHeatmap ? 'Hide' : 'Show'} Suspicious Areas
                </button>
                
                <div className="cyber-badge-alt text-xs">
                  Confidence: {confidence}%
                </div>
              </div>
            )}
            
            {(fileType === 'audio' || !isFake) && (
              <div className="mt-4 flex justify-end">
                <div className={`${isFake ? 'cyber-badge-alt' : 'cyber-badge'} text-xs`}>
                  Confidence: {confidence}%
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col">
            <div className={`p-6 rounded-lg ${isFake ? 'bg-cyber-red/10 border border-cyber-red/30' : 'bg-cyber-green/10 border border-cyber-green/30'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isFake ? 'text-cyber-red' : 'text-cyber-green'}`}>
                Analysis Results
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="confidence-meter">
                    <div 
                      className="confidence-meter-fill"
                      style={{ 
                        height: `${confidence}%`,
                        backgroundColor: isFake ? '#ff0055' : '#00ff9f'
                      }}
                    ></div>
                    <div className="confidence-meter-text">
                      {confidence}%
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-bold mb-1">Detection Confidence</p>
                    <p className="text-sm text-gray-400">
                      {isFake 
                        ? `Our AI is confident this ${fileType} has been manipulated` 
                        : `Our AI is confident this ${fileType} is authentic`}
                    </p>
                  </div>
                </div>
                
                {isFake && fileType === 'audio' && (
                  <div>
                    <p className="font-bold mb-2">Detected Issues:</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                        <span>Unnatural voice patterns detected</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                        <span>Inconsistent frequency distribution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                        <span>Synthetic artifacts in spectral analysis</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {isFake && fileType !== 'audio' && (
                  <div>
                    <p className="font-bold mb-2">Detected Issues:</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                        <span>Inconsistent facial features detected</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                        <span>Unnatural blending around facial boundaries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-cyber-red shrink-0 mt-0.5" />
                        <span>Abnormal texture patterns identified</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {!isFake && fileType === 'audio' && (
                  <div>
                    <p className="font-bold mb-2">Verification Results:</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                        <span>Natural voice patterns confirmed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                        <span>Consistent frequency distribution</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                        <span>No synthetic artifacts detected</span>
                      </li>
                    </ul>
                  </div>
                )}
                
                {!isFake && fileType !== 'audio' && (
                  <div>
                    <p className="font-bold mb-2">Verification Results:</p>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                        <span>Natural facial features confirmed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                        <span>Consistent lighting and reflections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
                        <span>Expected texture patterns throughout</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className={`mt-6 text-sm ${isFake ? 'text-cyber-pink' : 'text-cyber-blue'} hover:underline flex items-center gap-1`}
              >
                <Info className="w-4 h-4" />
                {showExplanation ? 'Hide' : 'Show'} Technical Explanation
              </button>
              
              {showExplanation && fileType === 'audio' && (
                <div className="mt-4 text-sm text-gray-300 p-4 bg-cyber-dark rounded-lg">
                  <p className="mb-2">
                    Our AI analyzes multiple aspects of the audio:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Voice frequency patterns and distributions</li>
                    <li>Spectral analysis for synthetic artifacts</li>
                    <li>Natural voice transitions and inflections</li>
                    <li>Breathing patterns and background noise consistency</li>
                    <li>Phoneme transitions and linguistic coherence</li>
                  </ul>
                </div>
              )}
              
              {showExplanation && fileType !== 'audio' && (
                <div className="mt-4 text-sm text-gray-300 p-4 bg-cyber-dark rounded-lg">
                  <p className="mb-2">
                    Our AI analyzes multiple aspects of the media:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Facial landmark consistency across frames</li>
                    <li>Texture and color patterns in skin regions</li>
                    <li>Reflection consistency in eyes and other surfaces</li>
                    <li>Blending artifacts around facial boundaries</li>
                    <li>Temporal coherence in video sequences</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mt-auto pt-6 flex flex-wrap gap-4 justify-center">
              <div className={isFake ? "cyber-badge-alt" : "cyber-badge"}>
                {isFake ? "Deepfake Detector" : "Authenticity Verified"}
              </div>
              
              <button className="cyber-button flex items-center gap-2 text-sm">
                <Share2 className="w-4 h-4" />
                Share Result
              </button>
              
              <button className="cyber-button-alt flex items-center gap-2 text-sm">
                <Download className="w-4 h-4" />
                Download Report
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-cyber-blue transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
      
      {/* Sound effects */}
      <audio 
        ref={alertSoundRef} 
        src="https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3" 
        preload="auto"
      />
      <audio 
        ref={successSoundRef} 
        src="https://assets.mixkit.co/active_storage/sfx/956/956-preview.mp3" 
        preload="auto"
      />
    </div>
  );
};

// Heatmap overlay component to highlight suspicious areas
const HeatmapOverlay: React.FC<{ areas: SuspiciousArea[] }> = ({ areas }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <radialGradient id="heatmap-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(255, 0, 85, 0.9)" />
            <stop offset="50%" stopColor="rgba(255, 0, 85, 0.5)" />
            <stop offset="100%" stopColor="rgba(255, 0, 85, 0)" />
          </radialGradient>
        </defs>
        
        {areas.map((area, index) => (
          <circle
            key={index}
            cx={`${area.x * 100}%`}
            cy={`${area.y * 100}%`}
            r={`${area.radius * 100}%`}
            fill="url(#heatmap-gradient)"
            opacity={area.intensity}
          />
        ))}
      </svg>
    </div>
  );
};

// Audio waveform visualization
const AudioWaveform: React.FC<{ isFake: boolean }> = ({ isFake }) => {
  const [bars, setBars] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const barCount = 100;
    const bars = [];
    
    for (let i = 0; i < barCount; i++) {
      // Create a pattern with some anomalies if fake
      let height;
      
      if (isFake && (i % 15 === 0 || i % 23 === 0)) {
        // Create anomaly spikes for fake audio
        height = 70 + Math.random() * 30;
      } else {
        // Normal waveform
        height = 10 + Math.sin(i * 0.2) * 30 + Math.random() * 20;
      }
      
      bars.push(
        <div 
          key={i}
          className={`w-1 mx-px ${isFake ? 'bg-cyber-red' : 'bg-cyber-green'}`}
          style={{ 
            height: `${height}%`,
            opacity: isFake && (i % 15 === 0 || i % 23 === 0) ? 0.9 : 0.5
          }}
        />
      );
    }
    
    setBars(bars);
  }, [isFake]);
  
  return (
    <div className="w-full h-32 flex items-center justify-center">
      <div className="w-full h-full flex items-center">
        {bars}
      </div>
    </div>
  );
};

export default ResultDisplay;
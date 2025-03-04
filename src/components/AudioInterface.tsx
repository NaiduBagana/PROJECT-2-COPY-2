import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Upload, Play, Square, Scan, ArrowRight } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const AudioInterface: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<React.ReactNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Setup audio visualizer
  useEffect(() => {
    const barCount = 40;
    const bars = [];
    
    for (let i = 0; i < barCount; i++) {
      const height = isRecording || isPlaying 
        ? 10 + Math.random() * 80 
        : 5 + Math.random() * 15;
        
      bars.push(
        <div 
          key={i}
          className="audio-bar"
          style={{ 
            height: `${height}%`,
            opacity: isRecording || isPlaying ? 0.7 + Math.random() * 0.3 : 0.3,
            transition: 'height 100ms ease'
          }}
        />
      );
    }
    
    setVisualizerBars(bars);
    
    // Update visualizer animation
    if (isRecording || isPlaying) {
      const interval = setInterval(() => {
        const newBars = [];
        for (let i = 0; i < barCount; i++) {
          const height = 10 + Math.random() * 80;
          newBars.push(
            <div 
              key={i}
              className="audio-bar"
              style={{ 
                height: `${height}%`,
                opacity: 0.7 + Math.random() * 0.3,
                transition: 'height 100ms ease'
              }}
            />
          );
        }
        setVisualizerBars(newBars);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isRecording, isPlaying]);
  
  // Handle file upload
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setAudioFile(file);
      
      // Create audio URL
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      // Reset recording state
      setIsRecording(false);
      audioChunksRef.current = [];
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': []
    },
    maxFiles: 1
  });
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create a File from the Blob
        const file = new File([audioBlob], "recorded-audio.wav", { type: 'audio/wav' });
        
        setAudioFile(file);
        setAudioUrl(audioUrl);
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle audio playback
  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  // Handle audio playback events
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef.current]);
  
  // Start analysis
  const startAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setAnalyzeProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Navigate to analysis screen
        navigate("/analysis", {
          state: {
            fileType: "audio",
            preview: audioUrl,
            file: audioFile,
            isAudio: true,
          },
        });
      }
    }, 100);
  };
  
  // Clear audio
  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioFile(null);
    setAudioUrl(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="cyber-panel-purple max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-8 cyber-text-glow-purple text-center">
          Audio Deepfake Detection
        </h1>
        
        {!audioFile && !isRecording ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-cyber-purple bg-cyber-purple bg-opacity-10 animate-pulse' 
                  : 'border-gray-600 hover:border-cyber-purple hover:bg-cyber-purple hover:bg-opacity-5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-cyber-purple" />
              <p className="text-xl mb-2">
                {isDragActive ? 'Drop the audio file here' : 'Drag & drop an audio file'}
              </p>
              <p className="text-gray-400">or click to select a file</p>
              <p className="mt-4 text-sm text-gray-500">
                Supported formats: MP3, WAV, M4A, FLAC
              </p>
            </div>
            
            <div className="border-2 border-cyber-purple/30 rounded-lg p-8 text-center flex flex-col items-center justify-center">
              <Mic className="w-12 h-12 mb-4 text-cyber-purple" />
              <p className="text-xl mb-4">Record Audio</p>
              <button 
                onClick={startRecording}
                className="cyber-button-purple flex items-center gap-2"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="audio-waveform">
              <div className="audio-visualizer">
                {visualizerBars}
              </div>
            </div>
            
            {isRecording ? (
              <div className="flex flex-col items-center">
                <div className="text-2xl font-mono text-cyber-purple mb-4 animate-pulse">
                  {formatTime(recordingTime)}
                </div>
                
                <button 
                  onClick={stopRecording}
                  className="cyber-button-purple flex items-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {audioUrl && (
                  <>
                    <audio ref={audioRef} src={audioUrl} className="hidden" />
                    
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={togglePlayback}
                        className="cyber-button-purple flex items-center gap-2"
                      >
                        {isPlaying ? (
                          <>
                            <Square className="w-5 h-5" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Play
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={clearAudio}
                        className="cyber-button-alt flex items-center gap-2"
                      >
                        Clear
                      </button>
                    </div>
                    
                    <div className="flex justify-center">
                      <button 
                        onClick={startAnalysis}
                        className="cyber-button-purple flex items-center gap-2"
                        disabled={isAnalyzing}
                      >
                        <Scan className="w-5 h-5" />
                        Analyze for Deepfakes
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                    
                    {isAnalyzing && (
                      <div className="mt-4">
                        <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-cyber-purple transition-all duration-300 ease-out"
                            style={{ width: `${analyzeProgress}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-right text-cyber-purple font-mono">
                          {Math.floor(analyzeProgress)}%
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-cyber-purple transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioInterface;
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Brain, Cpu, Database, Network } from "lucide-react";

interface LocationState {
  fileType: "image" | "video";
  preview: string;
}

const AnalysisScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileType, preview } = location.state as LocationState;

  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const analysisStages = [
    "Initializing neural network...",
    "Extracting facial landmarks...",
    "Analyzing temporal consistency...",
    "Detecting compression artifacts...",
    "Examining light reflections...",
    "Checking for unnatural blending...",
    "Verifying audio-visual sync...",
    "Running final verification...",
  ];

  useEffect(() => {
    // Simulate analysis process
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsComplete(true);

          // Navigate to results after a short delay
          setTimeout(() => {
            // Randomly determine if it's real or fake for demo purposes
            const isFake = Math.random() > 0.5;
            navigate("/result", {
              state: {
                isFake,
                fileType,
                preview,
                confidence: 70 + Math.floor(Math.random() * 25),
                suspiciousAreas: isFake ? generateSuspiciousAreas() : [],
              },
            });
          }, 1500);

          return 100;
        }

        const newProgress = prev + (1 + Math.random());

        // Update the current stage based on progress
        const newStage = Math.min(
          Math.floor((newProgress / 100) * analysisStages.length),
          analysisStages.length - 1
        );

        if (newStage !== currentStage) {
          setCurrentStage(newStage);
        }

        return newProgress > 100 ? 100 : newProgress;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [navigate, fileType, preview, currentStage]);

  // Generate random suspicious areas for demo
  const generateSuspiciousAreas = () => {
    const areas = [];
    const areaCount = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < areaCount; i++) {
      areas.push({
        x: 0.2 + Math.random() * 0.6, // Between 20% and 80% of width
        y: 0.2 + Math.random() * 0.6, // Between 20% and 80% of height
        radius: 0.05 + Math.random() * 0.15, // Between 5% and 20% of dimensions
        intensity: 0.6 + Math.random() * 0.4, // Between 60% and 100% intensity
      });
    }

    return areas;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="cyber-panel max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-8 cyber-text-glow text-center">
          Analyzing Media for Deepfake Artifacts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden border border-cyber-blue">
            {fileType === "image" ? (
              <img
                src={preview}
                alt="Analyzing"
                className="w-full object-contain bg-cyber-dark"
              />
            ) : (
              <video
                src={preview}
                className="w-full bg-cyber-dark"
                autoPlay
                muted
                loop
              />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyber-blue transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-right text-cyber-blue font-mono">
                {Math.floor(progress)}%
              </p>
            </div>

            <div className="mb-8">
              <p className="text-lg cyber-text-glow animate-pulse">
                {analysisStages[currentStage]}
              </p>
            </div>

            <div className="neural-network-visualization relative h-40 border border-cyber-blue/30 rounded-lg p-4 bg-cyber-dark bg-opacity-50 overflow-hidden">
              <NeuralNetworkAnimation isComplete={isComplete} />
            </div>

            {isComplete && (
              <div className="mt-6 text-center">
                <p className="text-cyber-green text-xl font-bold animate-pulse">
                  Analysis Complete!
                </p>
                <p className="text-gray-400 mt-2">Redirecting to results...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Neural network animation component
const NeuralNetworkAnimation: React.FC<{ isComplete: boolean }> = ({
  isComplete,
}) => {
  const [nodes, setNodes] = useState<React.ReactNode[]>([]);
  const [connections, setConnections] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const nodeCount = 20;
    const newNodes = [];
    const newConnections = [];
    const nodePositions: { x: number; y: number }[] = [];

    // Create nodes
    for (let i = 0; i < nodeCount; i++) {
      const x = 10 + Math.random() * 80; // % of width
      const y = 10 + Math.random() * 80; // % of height
      nodePositions.push({ x, y });

      const size = 4 + Math.random() * 8;
      const delay = Math.random() * 5;
      const duration = 1 + Math.random() * 2;

      newNodes.push(
        <div
          key={`node-${i}`}
          className={`absolute rounded-full bg-cyber-blue transition-all duration-300 ${
            isComplete ? "bg-cyber-green" : ""
          }`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}%`,
            top: `${y}%`,
            boxShadow: `0 0 ${size}px rgba(0, 240, 255, 0.7)`,
            animation: `pulse ${duration}s ease-in-out ${delay}s infinite alternate`,
          }}
        />
      );
    }

    // Create connections between some nodes
    for (let i = 0; i < nodeCount; i++) {
      const connectionsPerNode = 1 + Math.floor(Math.random() * 3);

      for (let j = 0; j < connectionsPerNode; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i) {
          const startNode = nodePositions[i];
          const endNode = nodePositions[targetIndex];

          // Calculate line properties
          const length = Math.sqrt(
            Math.pow(endNode.x - startNode.x, 2) +
              Math.pow(endNode.y - startNode.y, 2)
          );

          const angle =
            Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x) *
            (180 / Math.PI);

          const delay = Math.random() * 5;
          const duration = 0.5 + Math.random();

          newConnections.push(
            <div
              key={`conn-${i}-${j}`}
              className={`absolute h-px bg-cyber-blue opacity-30 transition-all duration-300 ${
                isComplete ? "bg-cyber-green" : ""
              }`}
              style={{
                width: `${length}%`,
                left: `${startNode.x}%`,
                top: `${startNode.y}%`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: "0 0",
                animation: `pulse ${duration}s ease-in-out ${delay}s infinite alternate`,
              }}
            />
          );
        }
      }
    }

    setNodes(newNodes);
    setConnections(newConnections);
  }, [isComplete]);

  return (
    <>
      {connections}
      {nodes}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-cyber-blue">
        <Cpu className="w-3 h-3" />
        <span>Neural Processing</span>
      </div>
    </>
  );
};

export default AnalysisScreen;

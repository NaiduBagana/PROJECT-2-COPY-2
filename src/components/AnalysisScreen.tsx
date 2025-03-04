import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Cpu } from "lucide-react";
import { detectDeepfakeVideo, detectDeepfakeAudio } from "./deepfakeApi";

interface LocationState {
  fileType: "video" | "audio" | "image";
  preview: string;
  file: File;
}

const AnalysisScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fileType, preview, file } = location.state as LocationState;

  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState(
    "Initializing analysis..."
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    // Increase progress until API call completes
    progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 200);

    const analyzeMedia = async () => {
      try {
        let response;
        if (fileType === "video") {
          response = await detectDeepfakeVideo(file);
          // Convert deepfake_probability (assumed 0–1) to percentage
          const confidence = Math.round(response.deepfake_probability * 100);
          const isFake = confidence > 50; // adjust threshold as needed
          const suspiciousAreas = isFake ? generateSuspiciousAreas() : [];
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(() => {
            navigate("/result", {
              state: { isFake, fileType, preview, confidence, suspiciousAreas },
            });
          }, 1000);
        } else if (fileType === "audio") {
          response = await detectDeepfakeAudio(file);
          const isFake = response.result.toLowerCase() === "fake";
          const confidence = Math.round(response.probability * 100);
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(() => {
            navigate("/result", {
              state: {
                isFake,
                fileType,
                preview,
                confidence,
                suspiciousAreas: [],
              },
            });
          }, 1000);
        } else {
          clearInterval(progressInterval);
          setError("Image analysis is not supported by the backend.");
        }
      } catch (err) {
        clearInterval(progressInterval);
        setError("Analysis failed. Please try again.");
        console.error(err);
      }
    };

    analyzeMedia();

    return () => clearInterval(progressInterval);
  }, [fileType, file, preview, navigate]);

  const generateSuspiciousAreas = () => {
    const areas = [];
    const areaCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < areaCount; i++) {
      areas.push({
        x: 0.2 + Math.random() * 0.6,
        y: 0.2 + Math.random() * 0.6,
        radius: 0.05 + Math.random() * 0.15,
        intensity: 0.6 + Math.random() * 0.4,
      });
    }
    return areas;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="cyber-panel max-w-4xl w-full p-6">
        <h1 className="text-3xl font-bold mb-8 cyber-text-glow text-center">
          Analyzing Media for Deepfake Artifacts
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden border border-cyber-blue">
            {fileType === "video" ? (
              <video
                src={preview}
                className="w-full bg-cyber-dark"
                autoPlay
                muted
                loop
              />
            ) : (
              <audio src={preview} controls className="w-full bg-cyber-dark" />
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
                {progress}%
              </p>
            </div>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <p className="text-lg cyber-text-glow animate-pulse">
                {analysisStage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisScreen;

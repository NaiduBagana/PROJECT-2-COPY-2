// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// //import { Cpu } from "lucide-react";
// import { detectDeepfakeVideo, detectDeepfakeAudio } from "../api/deepfakeApi";

// interface LocationState {
//   fileType: "video" | "audio" | "image";
//   preview: string;
//   file: File;
// }

// const AnalysisScreen: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { fileType, preview, file } = location.state as LocationState;

//   const [progress, setProgress] = useState(0);
//   const [analysisStage, setAnalysisStage] = useState(
//     "Initializing analysis..."
//   );
//   const [error, setError] = useState<string | null>(null);

//  useEffect(() => {
//    let progressInterval: number;

//    // Increase progress until API call completes
//    progressInterval = window.setInterval(() => {
//      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
//    }, 200);

//    const analyzeMedia = async () => {
//      try {
//        let response;
//        if (fileType === "video") {
//          response = await detectDeepfakeVideo(file);
//          // Convert deepfake_probability (assumed 0–1) to percentage
//         //  const confidence = Math.round(response.probability * 100);
//         //  const isFake = (response.result==="Real")?true:false; // adjust threshold as needed
//         const confidence = Math.round(response.deepfake_probability * 100);
//         // Define a threshold (for example, >50 means fake)
//         const isFake = confidence > 50;
//          const suspiciousAreas = isFake ? generateSuspiciousAreas() : [];
//          window.clearInterval(progressInterval);
//          setProgress(100);
//          setTimeout(() => {
//            navigate("/result", {
//              state: { isFake, fileType, preview, confidence, suspiciousAreas },
//            });
//          }, 1000);
//        } else if (fileType === "audio") {
//          response = await detectDeepfakeAudio(file);
//          const isFake = response.result.toLowerCase() === "fake";
//          const confidence = Math.round(response.probability * 100);
//          window.clearInterval(progressInterval);
//          setProgress(100);
//          setTimeout(() => {
//            navigate("/result", {
//              state: {
//                isFake,
//                fileType,
//                preview,
//                confidence,
//                suspiciousAreas: [],
//              },
//            });
//          }, 1000);
//        } else {
//          window.clearInterval(progressInterval);
//          setError("Image analysis is not supported by the backend.");
//        }
//      } catch (err) {
//        window.clearInterval(progressInterval);
//        setError("Analysis failed. Please try again.");
//        console.error(err);
//      }
//    };

//    analyzeMedia();

//    return () => window.clearInterval(progressInterval);
//  }, [fileType, file, preview, navigate]);

//   const generateSuspiciousAreas = () => {
//     const areas = [];
//     const areaCount = 2 + Math.floor(Math.random() * 3);
//     for (let i = 0; i < areaCount; i++) {
//       areas.push({
//         x: 0.2 + Math.random() * 0.6,
//         y: 0.2 + Math.random() * 0.6,
//         radius: 0.05 + Math.random() * 0.15,
//         intensity: 0.6 + Math.random() * 0.4,
//       });
//     }
//     return areas;
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4">
//       <div className="cyber-panel max-w-4xl w-full p-6">
//         <h1 className="text-3xl font-bold mb-8 cyber-text-glow text-center">
//           Analyzing Media for Deepfake Artifacts
//         </h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="rounded-lg overflow-hidden border border-cyber-blue">
//             {fileType === "video" ? (
//               <video
//                 src={preview}
//                 className="w-full bg-cyber-dark"
//                 autoPlay
//                 muted
//                 loop
//               />
//             ) : (
//               <audio src={preview} controls className="w-full bg-cyber-dark" />
//             )}
//           </div>
//           <div className="flex flex-col justify-center">
//             <div className="mb-6">
//               <div className="h-2 bg-cyber-dark rounded-full overflow-hidden">
//                 <div
//                   className="h-full bg-cyber-blue transition-all duration-300 ease-out"
//                   style={{ width: `${progress}%` }}
//                 ></div>
//               </div>
//               <p className="mt-2 text-right text-cyber-blue font-mono">
//                 {progress}%
//               </p>
//             </div>
//             {error ? (
//               <p className="text-red-500">{error}</p>
//             ) : (
//               <p className="text-lg cyber-text-glow animate-pulse">
//                 {analysisStage}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalysisScreen;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { detectDeepfakeVideo, detectDeepfakeAudio } from "../api/deepfakeApi";

interface LocationState {
  fileType: "video" | "audio" | "image";
  preview: string;
  file: File;
}

// Define the expected API response structure
interface DeepfakeResponse {
  deepfake_probability: number; // Expecting a value between 0-1
  result?: string; // Optional "Real" or "Fake" string
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
    let progressInterval: number;

    // Increase progress until API call completes
    progressInterval = window.setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 200);

    const analyzeMedia = async () => {
      try {
        let response: DeepfakeResponse;

        // Update analysis stage
        setAnalysisStage("Analyzing media for deepfake artifacts...");

        if (fileType === "video" || fileType === "image") {
          // We'll use video detection for both video and image
          response = await detectDeepfakeVideo(file);

          // Convert deepfake_probability (assumed 0-1) to percentage
          const confidence = Math.round(response.deepfake_probability * 100);

          // Define a threshold (for example, >50 means fake)
          const isFake = confidence > 50;

          // Generate fake suspicious areas for visualization
          const suspiciousAreas = isFake ? generateSuspiciousAreas() : [];

          // Update UI to show completion
          window.clearInterval(progressInterval);
          setProgress(100);
          setAnalysisStage("Analysis complete!");

          // Navigate to results page after a short delay
          setTimeout(() => {
            navigate("/result", {
              state: {
                isFake,
                fileType,
                preview,
                confidence,
                suspiciousAreas,
              },
            });
          }, 1000);
        } else if (fileType === "audio") {
          response = await detectDeepfakeAudio(file);

          // Determine if fake based on probability
          const confidence = Math.round(response.deepfake_probability * 100);
          const isFake = confidence > 50;

          // Update UI
          window.clearInterval(progressInterval);
          setProgress(100);
          setAnalysisStage("Analysis complete!");

          // Navigate to results
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
          window.clearInterval(progressInterval);
          setError("Unsupported media type for analysis.");
        }
      } catch (err) {
        window.clearInterval(progressInterval);
        setError("Analysis failed. Please try again.");
        console.error("API Error:", err);
      }
    };

    analyzeMedia();

    return () => window.clearInterval(progressInterval);
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
            ) : fileType === "audio" ? (
              <audio src={preview} controls className="w-full bg-cyber-dark" />
            ) : (
              <img
                src={preview}
                alt="Captured"
                className="w-full bg-cyber-dark"
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
                {progress}%
              </p>
            </div>
            {error ? (
              <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-md">
                <p className="text-lg font-semibold">Error</p>
                <p>{error}</p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-4 py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-500 rounded-md"
                >
                  Return to Home
                </button>
              </div>
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
// // This file contains the API integration for the deepfake detection backend

// // Mock API for demonstration purposes
// // In a real application, this would connect to your actual backend API

// /**
//  * Analyzes media for deepfake detection
//  * @param file The file to analyze (image or video)
//  * @returns Promise with analysis results
//  */
// export const analyzeMedia = async (file: File): Promise<AnalysisResult> => {
//   // In a real implementation, this would upload the file to your backend
//   // and receive the analysis results
  
//   // Simulate API call with a delay
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // For demo purposes, randomly determine if it's fake or real
//       const isFake = Math.random() > 0.5;
//       const confidence = 70 + Math.floor(Math.random() * 25);
      
//       // Generate random suspicious areas if fake
//       const suspiciousAreas = isFake ? generateRandomSuspiciousAreas() : [];
      
//       resolve({
//         isFake,
//         confidence,
//         suspiciousAreas,
//         analysisId: `analysis-${Date.now()}`,
//         timestamp: new Date().toISOString(),
//       });
//     }, 3000); // Simulate 3 second processing time
//   });
// };

// /**
//  * Analyzes webcam stream for deepfake detection
//  * @param videoElement The video element with the webcam stream
//  * @returns Promise with analysis results
//  */
// export const analyzeWebcamStream = async (videoElement: HTMLVideoElement): Promise<AnalysisResult> => {
//   // In a real implementation, this would capture frames from the video element
//   // and send them to your backend for analysis
  
//   // Simulate API call with a delay
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // For demo purposes, randomly determine if it's fake or real
//       const isFake = Math.random() > 0.5;
//       const confidence = 70 + Math.floor(Math.random() * 25);
      
//       // Generate random suspicious areas if fake
//       const suspiciousAreas = isFake ? generateRandomSuspiciousAreas() : [];
      
//       resolve({
//         isFake,
//         confidence,
//         suspiciousAreas,
//         analysisId: `webcam-${Date.now()}`,
//         timestamp: new Date().toISOString(),
//       });
//     }, 3000); // Simulate 3 second processing time
//   });
// };

// /**
//  * Analyzes audio for deepfake detection
//  * @param audioFile The audio file to analyze
//  * @returns Promise with analysis results
//  */
// export const analyzeAudio = async (audioFile: File): Promise<AnalysisResult> => {
//   // In a real implementation, this would upload the audio file to your backend
//   // and receive the analysis results
  
//   // Simulate API call with a delay
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // For demo purposes, randomly determine if it's fake or real
//       const isFake = Math.random() > 0.5;
//       const confidence = 70 + Math.floor(Math.random() * 25);
      
//       resolve({
//         isFake,
//         confidence,
//         suspiciousAreas: [], // Audio doesn't use suspicious areas
//         analysisId: `audio-${Date.now()}`,
//         timestamp: new Date().toISOString(),
//         audioSpectrumData: generateAudioSpectrumData(isFake),
//       });
//     }, 3000); // Simulate 3 second processing time
//   });
// };

// /**
//  * Generates a shareable report of the analysis
//  * @param analysisId The ID of the analysis to share
//  * @returns Promise with the sharing URL
//  */
// export const generateShareableReport = async (analysisId: string): Promise<string> => {
//   // In a real implementation, this would generate a shareable link on your backend
  
//   // Simulate API call with a delay
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(`https://deepfake-detector.example.com/report/${analysisId}`);
//     }, 1000);
//   });
// };

// // Helper function to generate random suspicious areas for demo
// const generateRandomSuspiciousAreas = (): SuspiciousArea[] => {
//   const areas = [];
//   const areaCount = 2 + Math.floor(Math.random() * 3);
  
//   for (let i = 0; i < areaCount; i++) {
//     areas.push({
//       x: 0.2 + Math.random() * 0.6, // Between 20% and 80% of width
//       y: 0.2 + Math.random() * 0.6, // Between 20% and 80% of height
//       radius: 0.05 + Math.random() * 0.15, // Between 5% and 20% of dimensions
//       intensity: 0.6 + Math.random() * 0.4 // Between 60% and 100% intensity
//     });
//   }
  
//   return areas;
// };

// // Helper function to generate fake audio spectrum data
// const generateAudioSpectrumData = (isFake: boolean): number[] => {
//   const data = [];
//   const dataPoints = 100;
  
//   for (let i = 0; i < dataPoints; i++) {
//     // Create a pattern with some anomalies if fake
//     let value;
    
//     if (isFake && (i % 15 === 0 || i % 23 === 0)) {
//       // Create anomaly spikes for fake audio
//       value = 0.7 + Math.random() * 0.3;
//     } else {
//       // Normal waveform
//       value = 0.1 + Math.sin(i * 0.2) * 0.3 + Math.random() * 0.2;
//     }
    
//     data.push(value);
//   }
  
//   return data;
// };

// // Types
// export interface SuspiciousArea {
//   x: number; // Normalized x-coordinate (0-1)
//   y: number; // Normalized y-coordinate (0-1)
//   radius: number; // Normalized radius (0-1)
//   intensity: number; // Intensity of the suspicious area (0-1)
// }

// export interface AnalysisResult {
//   isFake: boolean;
//   confidence: number; // 0-100
//   suspiciousAreas: SuspiciousArea[];
//   analysisId: string;
//   timestamp: string;
//   audioSpectrumData?: number[]; // For audio analysis
// }

//ab......
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const detectDeepfakeVideo = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_BASE_URL}/detect-deepfake`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error detecting deepfake video:", error);
    throw error;
  }
};

export const detectDeepfakeAudio = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_BASE_URL}/detect-deepfake-audio`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error detecting deepfake audio:", error);
    throw error;
  }
};

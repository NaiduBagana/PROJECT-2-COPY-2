// // import React, { useState, useRef, useCallback } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Webcam from 'react-webcam';
// // import { Camera, Video, Scan, ArrowRight } from 'lucide-react';
// import React, { useState, useRef, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import Webcam from "react-webcam";
// import { Camera, Video, Scan, ArrowRight } from "lucide-react";
// import { detectDeepfakeVideo, detectDeepfakeAudio } from "../api/deepfakeApi";

// const WebcamInterface: React.FC = () => {
//   const navigate = useNavigate();
//   const webcamRef = useRef<Webcam>(null);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);
//   const [isRecording, setIsRecording] = useState(false);
//   const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const [scanProgress, setScanProgress] = useState(0);
//   const [isScanning, setIsScanning] = useState(false);

//   const videoConstraints = {
//     width: 1280,
//     height: 720,
//     facingMode: "user"
//   };

//   const captureImage = useCallback(() => {
//     if (webcamRef.current) {
//       const imageSrc = webcamRef.current.getScreenshot();
//       setCapturedImage(imageSrc);
//       setIsCapturing(true);
//     }
//   }, [webcamRef]);

//   // const handleStartRecording = useCallback(() => {
//   //   setIsRecording(true);
//   //   setCapturedImage(null);
    
//   //   if (webcamRef.current && webcamRef.current.stream) {
//   //     mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
//   //       mimeType: "video/webm"
//   //     });
      
//   //     mediaRecorderRef.current.addEventListener("dataavailable", ({ data }) => {
//   //       if (data.size > 0) {
//   //         setRecordedChunks((prev) => [...prev, data]);
//   //       }
//   //     });
      
//   //     mediaRecorderRef.current.start();
//   //   }
//   // }, [webcamRef, setRecordedChunks]);

//   // const handleStopRecording = useCallback(() => {
//   //   if (mediaRecorderRef.current) {
//   //     mediaRecorderRef.current.stop();
//   //   }
//   //   setIsRecording(false);
//   //   setIsCapturing(true);
//   // }, [mediaRecorderRef, setIsRecording]);
//   const handleStartRecording = useCallback(() => {
//     setIsRecording(true);
//     setCapturedImage(null);
//     // Clear any previous recordings
//     setRecordedChunks([]);

//     if (webcamRef.current && webcamRef.current.stream) {
//       mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
//         mimeType: "video/webm",
//       });

//       mediaRecorderRef.current.addEventListener("dataavailable", ({ data }) => {
//         if (data.size > 0) {
//           setRecordedChunks((prev) => [...prev, data]);
//         }
//       });

//       mediaRecorderRef.current.start();
//     }
//   }, [webcamRef, setRecordedChunks]);

//   const handleStopRecording = useCallback(() => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//     setIsRecording(false);
//     setIsCapturing(true);
//   }, [mediaRecorderRef, setIsRecording]);

//   const handleReset = () => {
//     setCapturedImage(null);
//     setRecordedChunks([]);
//     setIsCapturing(false);
//   };
//   const dataURLtoFile = (dataurl: string, filename: string): File => {
//     const arr = dataurl.split(",");
//     const mime = arr[0].match(/:(.*?);/)![1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, { type: mime });
//   };

// //  const handleStartScan = () => {
// //    setIsScanning(true);

// //    // Simulate scanning progress
// //    let progress = 0;
// //    const interval = setInterval(() => {
// //      progress += 2;
// //      setScanProgress(progress);

// //      if (progress >= 100) {
// //        clearInterval(interval);

// //        if (capturedImage) {
// //          // Convert capturedImage (base64) to File
// //          const file = dataURLtoFile(capturedImage, "captured-image.jpg");
// //          navigate("/analysis", {
// //            state: {
// //              fileType: "image",
// //              preview: capturedImage,
// //              file, // Pass the file object
// //            },
// //          });
// //        } else {
// //          // For recorded video, create a File from recordedChunks
// //          const blob = new Blob(recordedChunks, { type: "video/webm" });
// //          const file = new File([blob], "recorded-video.webm", {
// //            type: "video/webm",
// //          });
// //          const previewUrl = URL.createObjectURL(blob);
// //          navigate("/analysis", {
// //            state: {
// //              fileType: "video",
// //              preview: previewUrl,
// //              file, // Pass the file object
// //            },
// //          });
// //        }
// //      }
// //    }, 100);
// //  };

// const [analysisError, setAnalysisError] = useState<string | null>(null);

// const handleStartScan = async () => {
//   setIsScanning(true);
//   setAnalysisError(null);

//   try {
//     // Start progress animation
//     let progress = 0;
//     const interval = setInterval(() => {
//       progress += 2;
//       setScanProgress(Math.min(progress, 95)); // Cap at 95% until we get actual results

//       if (progress >= 95) {
//         clearInterval(interval);
//       }
//     }, 100);

//     let result;
//     let fileType;
//     let preview;
//     let file;

//     if (capturedImage) {
//       // Handle image analysis
//       fileType = "image";
//       preview = capturedImage;
//       file = dataURLtoFile(capturedImage, "captured-image.jpg");

//       // For images, we'll use the video detection API
//       result = await detectDeepfakeVideo(file);
//     } else if (recordedChunks.length > 0) {
//       // Handle video analysis
//       fileType = "video";
//       const blob = new Blob(recordedChunks, { type: "video/webm" });
//       file = new File([blob], "recorded-video.webm", { type: "video/webm" });
//       preview = URL.createObjectURL(blob);

//       // For videos, we'll use the video detection API
//       result = await detectDeepfakeVideo(file);
//     } else {
//       throw new Error("No media captured");
//     }

//     // Complete the progress
//     setScanProgress(100);
//     clearInterval(interval);

//     // Navigate to analysis page with results
//     navigate("/analysis", {
//       state: {
//         fileType,
//         preview,
//         file,
//         result, // Include the analysis result
//       },
//     });
//   } catch (error) {
//     console.error("Analysis failed:", error);
//     setAnalysisError("Analysis failed. Please try again.");
//     setIsScanning(false);
//     setScanProgress(0);
//   }
// };
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-4">
//       <div className="cyber-panel max-w-4xl w-full">
//         <h1 className="text-3xl font-bold mb-8 cyber-text-glow text-center">
//           Webcam Deepfake Scanner
//         </h1>

//         <div className="relative">
//           {!isCapturing ? (
//             <>
//               <div className="relative rounded-lg overflow-hidden border-2 border-cyber-blue animate-glow">
//                 <Webcam
//                   audio={true}
//                   ref={webcamRef}
//                   screenshotFormat="image/jpeg"
//                   videoConstraints={videoConstraints}
//                   className="w-full"
//                 />

//                 {isScanning && (
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="w-64 h-64 rounded-full border-4 border-cyber-blue animate-pulse-slow">
//                       <div className="w-full h-full rounded-full animate-spin-slow border-t-4 border-cyber-pink"></div>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-6 flex flex-wrap gap-4 justify-center">
//                 <button
//                   onClick={captureImage}
//                   className="cyber-button group flex items-center gap-2"
//                   disabled={isScanning}
//                 >
//                   <Camera className="w-5 h-5" />
//                   Capture Image
//                 </button>

//                 {!isRecording ? (
//                   <button
//                     onClick={handleStartRecording}
//                     className="cyber-button-alt group flex items-center gap-2"
//                     disabled={isScanning}
//                   >
//                     <Video className="w-5 h-5" />
//                     Record Video
//                   </button>
//                 ) : (
//                   <button
//                     onClick={handleStopRecording}
//                     className="cyber-button-alt group flex items-center gap-2 animate-pulse"
//                   >
//                     <span className="w-3 h-3 bg-cyber-red rounded-full"></span>
//                     Stop Recording
//                   </button>
//                 )}
//               </div>
//             </>
//           ) : (
//             <div className="rounded-lg overflow-hidden border-2 border-cyber-blue">
//               {/* {capturedImage ? (
//                 <img src={capturedImage} alt="Captured" className="w-full" />
//               ) : (
//                 <video
//                   src={URL.createObjectURL(
//                     new Blob(recordedChunks, { type: "video/webm" })
//                   )}
//                   controls
//                   className="w-full"
//                 />
//               )} */}
//               {capturedImage ? (
//                 <img src={capturedImage} alt="Captured" className="w-full" />
//               ) : recordedChunks.length > 0 ? (
//                 <video
//                   src={URL.createObjectURL(
//                     new Blob(recordedChunks, { type: "video/webm" })
//                   )}
//                   controls
//                   className="w-full"
//                 />
//               ) : (
//                 <div className="bg-gray-800 w-full h-64 flex items-center justify-center">
//                   <p className="text-gray-400">No media captured</p>
//                 </div>
//               )}

//               {isScanning && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-cyber-black bg-opacity-50">
//                   <div className="text-center">
//                     <div className="w-32 h-32 mx-auto relative">
//                       <svg className="w-full h-full" viewBox="0 0 100 100">
//                         <circle
//                           cx="50"
//                           cy="50"
//                           r="45"
//                           fill="none"
//                           stroke="#121225"
//                           strokeWidth="8"
//                         />
//                         <circle
//                           cx="50"
//                           cy="50"
//                           r="45"
//                           fill="none"
//                           stroke="#00f0ff"
//                           strokeWidth="8"
//                           strokeDasharray="283"
//                           strokeDashoffset={283 - (283 * scanProgress) / 100}
//                           transform="rotate(-90 50 50)"
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex items-center justify-center">
//                         <span className="text-2xl font-bold cyber-text-glow">
//                           {scanProgress}%
//                         </span>
//                       </div>
//                     </div>
//                     <p className="mt-4 text-cyber-blue animate-pulse">
//                       Scanning for deepfake artifacts...
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* {isCapturing && !isScanning && (
//           <div className="mt-6 flex flex-wrap gap-4 justify-center">
//             <button 
//               onClick={handleReset}
//               className="cyber-button-alt group flex items-center gap-2"
//             >
//               Retake
//             </button>
            
//             <button 
//               onClick={handleStartScan}
//               className="cyber-button group flex items-center gap-2"
//             >
//               <Scan className="w-5 h-5" />
//               Start Scanning
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </button>
//           </div>
//         )}
//          */}
//         {isCapturing && !isScanning && (
//           <div className="mt-6 flex flex-wrap gap-4 justify-center">
//             <button
//               onClick={handleReset}
//               className="cyber-button-alt group flex items-center gap-2"
//             >
//               Retake
//             </button>

//             <button
//               onClick={handleStartScan}
//               className="cyber-button group flex items-center gap-2"
//             >
//               <Scan className="w-5 h-5" />
//               Start Scanning
//               <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//             </button>
//           </div>
//         )}

//         {analysisError && (
//           <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-300 rounded-md">
//             <p>{analysisError}</p>
//             <p className="text-sm mt-1">
//               Please check your internet connection and try again.
//             </p>
//           </div>
//         )}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => navigate("/")}
//             className="text-gray-400 hover:text-cyber-blue transition-colors"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WebcamInterface;  
import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { Camera, Video, Scan, ArrowRight } from "lucide-react";

const WebcamInterface: React.FC = () => {
  const navigate = useNavigate();
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setIsCapturing(true);
    }
  }, [webcamRef]);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setCapturedImage(null);
    // Clear any previous recordings
    setRecordedChunks([]);

    if (webcamRef.current && webcamRef.current.stream) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });

      mediaRecorderRef.current.addEventListener("dataavailable", ({ data }) => {
        if (data.size > 0) {
          setRecordedChunks((prev) => [...prev, data]);
        }
      });

      mediaRecorderRef.current.start();
    }
  }, [webcamRef, setRecordedChunks]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsCapturing(true);
  }, [mediaRecorderRef, setIsRecording]);

  const handleReset = () => {
    setCapturedImage(null);
    setRecordedChunks([]);
    setIsCapturing(false);
    setAnalysisError(null);
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setAnalysisError(null);

    try {
      // Start progress animation
      let progress = 0;
      const interval = setInterval(() => {
        progress += 2;
        setScanProgress(Math.min(progress, 95)); // Cap at 95% until we get actual results

        if (progress >= 95) {
          clearInterval(interval);
        }
      }, 100);

      // Prepare file data based on capture type
      let fileType;
      let preview;
      let file;

      if (capturedImage) {
        // Handle image analysis
        fileType = "image";
        preview = capturedImage;
        file = dataURLtoFile(capturedImage, "captured-image.jpg");
      } else if (recordedChunks.length > 0) {
        // Handle video analysis
        fileType = "video";
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        file = new File([blob], "recorded-video.webm", { type: "video/webm" });
        preview = URL.createObjectURL(blob);
      } else {
        throw new Error("No media captured");
      }

      // Stop the progress animation
      setScanProgress(100);
      clearInterval(interval);

      // Navigate to analysis page with file data
      navigate("/analysis", {
        state: {
          fileType,
          preview,
          file,
        },
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisError("Analysis failed. Please try again.");
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="cyber-panel max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-8 cyber-text-glow text-center">
          Webcam Deepfake Scanner
        </h1>

        <div className="relative">
          {!isCapturing ? (
            <>
              <div className="relative rounded-lg overflow-hidden border-2 border-cyber-blue animate-glow">
                <Webcam
                  audio={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="w-full"
                />

                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full border-4 border-cyber-blue animate-pulse-slow">
                      <div className="w-full h-full rounded-full animate-spin-slow border-t-4 border-cyber-pink"></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={captureImage}
                  className="cyber-button group flex items-center gap-2"
                  disabled={isScanning}
                >
                  <Camera className="w-5 h-5" />
                  Capture Image
                </button>

                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="cyber-button-alt group flex items-center gap-2"
                    disabled={isScanning}
                  >
                    <Video className="w-5 h-5" />
                    Record Video
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="cyber-button-alt group flex items-center gap-2 animate-pulse"
                  >
                    <span className="w-3 h-3 bg-cyber-red rounded-full"></span>
                    Stop Recording
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-lg overflow-hidden border-2 border-cyber-blue">
              {capturedImage ? (
                <img src={capturedImage} alt="Captured" className="w-full" />
              ) : recordedChunks.length > 0 ? (
                <video
                  src={URL.createObjectURL(
                    new Blob(recordedChunks, { type: "video/webm" })
                  )}
                  controls
                  className="w-full"
                />
              ) : (
                <div className="bg-gray-800 w-full h-64 flex items-center justify-center">
                  <p className="text-gray-400">No media captured</p>
                </div>
              )}

              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-cyber-black bg-opacity-50">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto relative">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#121225"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#00f0ff"
                          strokeWidth="8"
                          strokeDasharray="283"
                          strokeDashoffset={283 - (283 * scanProgress) / 100}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold cyber-text-glow">
                          {scanProgress}%
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-cyber-blue animate-pulse">
                      Preparing media for analysis...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isCapturing && !isScanning && (
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleReset}
              className="cyber-button-alt group flex items-center gap-2"
            >
              Retake
            </button>

            <button
              onClick={handleStartScan}
              className="cyber-button group flex items-center gap-2"
            >
              <Scan className="w-5 h-5" />
              Start Scanning
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}

        {analysisError && (
          <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-300 rounded-md">
            <p>{analysisError}</p>
            <p className="text-sm mt-1">
              Please check your internet connection and try again.
            </p>
          </div>
        )}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-cyber-blue transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebcamInterface;
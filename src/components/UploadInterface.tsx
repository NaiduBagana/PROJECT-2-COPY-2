import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Upload, X, AlertTriangle, ArrowRight } from "lucide-react";

const UploadInterface: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);

    if (acceptedFiles.length === 0) {
      return;
    }

    const selectedFile = acceptedFiles[0];

    // Check file type
    if (selectedFile.type.startsWith("image/")) {
      setFileType("image");
    } else if (selectedFile.type.startsWith("video/")) {
      setFileType("video");
    } else {
      setError("Please upload an image or video file.");
      return;
    }

    setFile(selectedFile);

    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    maxFiles: 1,
  });

  const clearFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    setFileType(null);
  };

  const handleAnalyze = () => {
    if (file) {
      // Pass the actual file along with preview and fileType
      navigate("/analysis", { state: { fileType, preview, file } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="cyber-panel max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-8 cyber-text-glow text-center">
          Upload Media for Deepfake Analysis
        </h1>

        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? "border-cyber-blue bg-cyber-blue bg-opacity-10 animate-pulse"
                : "border-gray-600 hover:border-cyber-blue hover:bg-cyber-blue hover:bg-opacity-5"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 mx-auto mb-4 text-cyber-blue" />
            <p className="text-xl mb-2">
              {isDragActive ? "Drop the file here" : "Drag & drop a file here"}
            </p>
            <p className="text-gray-400">or click to select a file</p>
            <p className="mt-4 text-sm text-gray-500">
              Supported formats: JPG, PNG, GIF, MP4, MOV, WebM
            </p>

            {error && (
              <div className="mt-4 text-cyber-red flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <div className="relative">
              <button
                onClick={clearFile}
                className="absolute top-2 right-2 bg-cyber-dark bg-opacity-70 p-2 rounded-full text-cyber-red hover:bg-opacity-100 transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="rounded-lg overflow-hidden border border-cyber-blue animate-glow">
                {fileType === "image" ? (
                  <img
                    src={preview!}
                    alt="Preview"
                    className="max-h-[60vh] w-full object-contain bg-cyber-dark"
                  />
                ) : (
                  <video
                    src={preview!}
                    controls
                    className="max-h-[60vh] w-full bg-cyber-dark"
                  />
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-cyber-blue font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • {fileType}
                  </p>
                </div>

                <button
                  onClick={handleAnalyze}
                  className="cyber-button group flex items-center gap-2"
                >
                  Analyze
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
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

export default UploadInterface;

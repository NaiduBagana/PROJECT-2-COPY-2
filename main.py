from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import tensorflow as tf
from tempfile import NamedTemporaryFile
import librosa
import pickle
import os

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load models with error handling
try:
    video_model = tf.keras.models.load_model("deepfake_detector.h5")
    audio_model = pickle.load(open('audio_model.pkl', 'rb'))
except Exception as e:
    print(f"Error loading models: {e}")
    video_model = None
    audio_model = None

def extract_video_frames(video_path, output_size=(224, 224), frame_count=50):
    """Extract frames from video"""
    try:
        cap = cv2.VideoCapture(video_path)
        frames = []
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        step = max(total_frames // frame_count, 1)
        
        for i in range(min(frame_count, total_frames)):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i * step)
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.resize(frame, output_size)
            frames.append(frame)
        
        cap.release()
        return np.array(frames) / 255.0
    except Exception as e:
        print(f"Video frame extraction error: {e}")
        return None

def predict_video_deepfake(video_path, model):
    """Predict deepfake probability for video"""
    if model is None:
        raise HTTPException(status_code=500, detail="Video model not loaded")
    
    frames = extract_video_frames(video_path)
    if frames is None:
        raise HTTPException(status_code=400, detail="Could not extract video frames")
    
    predictions = []
    for frame in frames:
        frame = np.expand_dims(frame, axis=0)
        prediction = model.predict(frame)[0][0]
        predictions.append(prediction)
    
    avg_prediction = np.mean(predictions)
    return {"deepfake_probability": float(avg_prediction)}

def extract_audio_features(audio_path):
    """Extract audio features for prediction"""
    try:
        audio, sample_rate = librosa.load(audio_path, sr=None)
        mfccs = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=13)
        return np.mean(mfccs.T, axis=0)
    except Exception as e:
        print(f"Audio feature extraction error: {e}")
        return None

def predict_audio_deepfake(audio_path, model):
    """Predict deepfake probability for audio"""
    if model is None:
        raise HTTPException(status_code=500, detail="Audio model not loaded")
    
    features = extract_audio_features(audio_path)
    if features is None:
        raise HTTPException(status_code=400, detail="Could not extract audio features")
    
    prediction = model.predict_proba([features])[0]
    probability = np.max(prediction)
    result = 'Fake' if probability > 0.5 else 'Real'
    
    return {
        "result": result, 
        "probability": float(probability)
    }

@app.post("/detect-deepfake")
async def detect_deepfake(file: UploadFile = File(...)):
    """Video deepfake detection endpoint"""
    try:
        with NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
            temp_video.write(await file.read())
            temp_video.flush()
            result = predict_video_deepfake(temp_video.name, video_model)
        
        # Cleanup temporary file
        os.unlink(temp_video.name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/detect-deepfake-audio")
async def detect_deepfake_audio(file: UploadFile = File(...)):
    """Audio deepfake detection endpoint"""
    try:
        with NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
            temp_audio.write(await file.read())
            temp_audio.flush()
            result = predict_audio_deepfake(temp_audio.name, audio_model)
        
        # Cleanup temporary file
        os.unlink(temp_audio.name)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

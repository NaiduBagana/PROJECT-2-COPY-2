// import axios from "axios";

// const API_BASE_URL = "http://localhost:8000";

// export interface VideoDetectionResponse {
//   deepfake_probability: number;
// }

// export interface AudioDetectionResponse {
//   result: string;
//   probability: number;
// }

// export const detectDeepfakeVideo = async (
//   file: File
// ): Promise<VideoDetectionResponse> => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     const response = await axios.post(
//       `${API_BASE_URL}/detect-deepfake`,
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error detecting deepfake video:", error);
//     throw error;
//   }
// };

// export const detectDeepfakeAudio = async (
//   file: File
// ): Promise<AudioDetectionResponse> => {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     const response = await axios.post(
//       `${API_BASE_URL}/detect-deepfake-audio`,
//       formData,
//       {
//         headers: { "Content-Type": "multipart/form-data" },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error detecting deepfake audio:", error);
//     throw error;
//   }
// };
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export interface VideoDetectionResponse {
  deepfake_probability: number;
}

export interface AudioDetectionResponse {
  result: string;
  probability: number;
}

export interface ImageDetectionResponse {
  result: string;
  probability: number;
}

export const detectDeepfakeVideo = async (
  file: File
): Promise<VideoDetectionResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_BASE_URL}/detect-deepfake`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error detecting deepfake video:", error);
    throw error;
  }
};

export const detectDeepfakeAudio = async (
  file: File
): Promise<AudioDetectionResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_BASE_URL}/detect-deepfake-audio`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error detecting deepfake audio:", error);
    throw error;
  }
};

export const detectDeepfakeImage = async (
  file: File
): Promise<ImageDetectionResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(
      `${API_BASE_URL}/detect-image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error detecting deepfake image:", error);
    throw error;
  }
};
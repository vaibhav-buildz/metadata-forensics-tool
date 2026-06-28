const API_BASE_URL = "http://127.0.0.1:8000/api";

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Analysis failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error("Error checking health:", error);
    return null;
  }
};

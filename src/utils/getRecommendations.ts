import axios from 'axios';

interface RecommendationRequest {
  preferences: string[];
}

interface RecommendationResponse {
  recommendations: string[];
}

export const getRecommendations = async (preferences: string[]): Promise<RecommendationResponse | null> => {
  if (!preferences || preferences.length === 0) {
    console.log('Invalid or missing preferences');
    return null;
  }

  try {
    const payload: RecommendationRequest = {
      preferences,
    };
    
    const response = await axios.post<RecommendationResponse>('http://host.docker.internal:8080/llm/generate', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.data) {
      throw new Error('No data received from LLM agent');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations from LLM agent:', error);
    return null; 
  }
};


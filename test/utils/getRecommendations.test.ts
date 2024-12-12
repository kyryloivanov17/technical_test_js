import axios from 'axios';
import {getRecommendations} from "../../src/utils/getRecommendations";

jest.mock('axios');

describe('getRecommendations', () => {
    it('should return null for empty or missing preferences', async () => {

        const result = await getRecommendations([]);

        expect(result).toBeNull();
    });

    it('should return recommendations on successful response', async () => {
        const mockResponse = { recommendations: ['item1', 'item2', 'item3'] };

        (axios.post as jest.Mock).mockResolvedValue({ data: mockResponse });

        const result = await getRecommendations(['preference1', 'preference2']);

        expect(result).toEqual(mockResponse);
        expect(axios.post).toHaveBeenCalledWith(
            'http://host.docker.internal:8080/llm/generate',
            { preferences: ['preference1', 'preference2'] },
            { headers: { 'Content-Type': 'application/json' } }
        );
    });

    it('should return null if no data is received from the response', async () => {
        (axios.post as jest.Mock).mockResolvedValue({ data: null });

        const result = await getRecommendations(['preference1']);

        expect(result).toBeNull();
    });

    it('should return null if an error occurs during the HTTP request', async () => {
        const errorMessage = 'Network error';
        (axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const result = await getRecommendations(['preference1']);

        expect(result).toBeNull();
    });
});

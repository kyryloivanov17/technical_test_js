import { Request, Response } from 'express';
import {getRecommendations} from "../../src/utils/getRecommendations";
import {getCache, setCache} from "../../src/utils/cache";
import {generateRecommendations} from "../../src/controllers/recommendations-controller";
import {RecommendationModel} from "../../src/models/recommendation";
import {UserModel} from "../../src/models/user";

jest.mock('../../src/models/user');
jest.mock('../../src/models/recommendation');
jest.mock('../../src/utils/getRecommendations');
jest.mock('../../src/utils/cache');

describe('Recommendations Controller Tests', () => {

    describe('generateRecommendations', () => {

        it('should return 400 if user_id is missing or invalid', async () => {
            const req = { body: { preferences: ['product1', 'product2'] } } as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await generateRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or missing user_id' });
        });

        it('should return 400 if preferences are invalid', async () => {
            const req = { body: { user_id: 'validUser123', preferences: '' } } as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            await generateRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Preferences must be a non-empty array of strings' });
        });

        it('should return 404 if user is not found', async () => {
            const req = { body: { user_id: 'nonExistingUser', preferences: ['product1'] } } as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            await generateRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });

        it('should return recommendations from cache if available', async () => {
            const mockUser = { _id: 'validUser123' };
            const mockPreferences = ['product1'];
            const mockCachedRecommendations = [{ id: 1, recommendation: 'Promo1' }];
            const req = { body: { user_id: 'validUser123', preferences: mockPreferences } } as Request;
            const res = { json: jest.fn() } as unknown as Response;

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (getCache as jest.Mock).mockReturnValue(mockCachedRecommendations);

            await generateRecommendations(req, res);

            expect(res.json).toHaveBeenCalledWith({ source: 'cache', recommendations: mockCachedRecommendations });
        });

        it('should fetch recommendations from external API and save to database if not in cache', async () => {
            const mockUser = { _id: 'validUser123' };
            const mockPreferences = ['product1'];
            const mockApiResponse = { recommendations: [{ id: 1, recommendation: 'Promo1' }] };
            const req = { body: { user_id: 'validUser123', preferences: mockPreferences } } as Request;
            const res = { json: jest.fn() } as unknown as Response;

            // Mock external API, UserModel, RecommendationModel, and cache functions
            (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (getCache as jest.Mock).mockReturnValue(null); // No cache
            (getRecommendations as jest.Mock).mockResolvedValue(mockApiResponse);
            (RecommendationModel.create as jest.Mock).mockResolvedValue(mockApiResponse.recommendations);
            (RecommendationModel.find as jest.Mock).mockResolvedValue(mockApiResponse.recommendations);
            (setCache as jest.Mock).mockResolvedValue(undefined); // Cache save successful

            await generateRecommendations(req, res);

            expect(res.json).toHaveBeenCalledWith({ source: 'database', recommendations: mockApiResponse.recommendations });
        });

        it('should handle errors from the external API gracefully', async () => {
            const mockUser = { _id: 'validUser123' };
            const req = { body: { user_id: 'validUser123', preferences: ['product1'] } } as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (getCache as jest.Mock).mockReturnValue(null);
            (getRecommendations as jest.Mock).mockRejectedValue(new Error('API error'));

            await generateRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unable to generate recommendations at this time. Please try again later.',
            });
        });

        it('should handle database errors gracefully when saving recommendations', async () => {
            const mockUser = { _id: 'validUser123' };
            const mockPreferences = ['product1'];
            const mockApiResponse = { recommendations: [{ id: 1, recommendation: 'Promo1' }] };
            const req = { body: { user_id: 'validUser123', preferences: mockPreferences } } as Request;
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response;

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (getCache as jest.Mock).mockReturnValue(null); // No cache
            (getRecommendations as jest.Mock).mockResolvedValue(mockApiResponse);
            (RecommendationModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

            await generateRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Unable to generate recommendations at this time. Please try again later.',
            });
        });
    });
});

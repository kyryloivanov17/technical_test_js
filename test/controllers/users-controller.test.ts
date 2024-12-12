import {Request, Response} from 'express';
import {UserModel} from "../../src/models/user";
import {RecommendationModel} from "../../src/models/recommendation";
import {createUser, getUserRecommendations} from "../../src/controllers/users-controller";

jest.mock('../../src/models/user');
jest.mock('../../src/models/recommendation');

describe('User Controller Tests', () => {

    describe('getUserRecommendations', () => {
        it('should return recommendations for a valid user', async () => {
            const mockUser = {_id: 'validUser123', name: 'John Doe'};
            const mockRecommendations = [{id: 1, recommendation: 'Recommended item 1'}];
            const req: Request = {} as Request;
            req.params = {user_id: 'validUser123'};
            const res = {status: jest.fn().mockReturnThis(), json: jest.fn()} as unknown as Response;

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (RecommendationModel.find as jest.Mock).mockResolvedValue(mockRecommendations);

            await getUserRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({user_id: 'validUser123', recommendations: mockRecommendations});
        });

        it('should return 404 if user is not found', async () => {
            const req: Request = {} as Request;
            req.params = {user_id: 'nonExistingUser'};
            const res = {status: jest.fn().mockReturnThis(), json: jest.fn()} as unknown as Response;

            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            await getUserRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({error: 'User not found'});
        });

        it('should return 404 if no recommendations are found for the user', async () => {
            const mockUser = {_id: 'validUser123', name: 'John Doe'};
            const req: Request = {} as Request;
            req.params = {user_id: 'validUser123'};
            const res = {status: jest.fn().mockReturnThis(), json: jest.fn()} as unknown as Response;

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);
            (RecommendationModel.find as jest.Mock).mockResolvedValue([]);

            await getUserRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({error: 'No recommendations found for user validUser123.'});
        });

        it('should return 500 if there is a server error', async () => {
            const req: Request = {} as Request;
            req.params = {user_id: 'validUser123'};
            const res = {status: jest.fn().mockReturnThis(), json: jest.fn()} as unknown as Response;

            (UserModel.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

            await getUserRecommendations(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'Unable to fetch recommendations at this time. Please try again later.'});
        });
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const req = {body: {name: 'John Doe', email: 'john.doe@example.com'}} as Request;
            const res = {json: jest.fn()} as unknown as Response;

            (UserModel.create as jest.Mock).mockResolvedValue(req.body);

            await createUser(req, res);

            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        it('should return 400 if user creation fails', async () => {
            const req = {body: {name: 'John Doe'}} as Request;
            const res = {status: jest.fn().mockReturnThis(), json: jest.fn()} as unknown as Response;

            (UserModel.create as jest.Mock).mockResolvedValue(null);

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: 'Unable to create user'});
        });

        it('should return 500 if there is a server error during user creation', async () => {
            const req = {body: {name: 'John Doe'}} as Request;
            const res = {status: jest.fn().mockReturnThis(), json: jest.fn()} as unknown as Response;

            (UserModel.create as jest.Mock).mockRejectedValue(new Error('Database error'));

            await createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({error: 'Unable to create user'});
        });
    });
});

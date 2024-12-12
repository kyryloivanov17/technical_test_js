import mongoose from 'mongoose';
import { connectDB } from '../../src/utils/database';

jest.mock('mongoose');

describe('Database Connection', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect to the database successfully', async () => {
        (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String));
        expect(consoleLogSpy).toHaveBeenCalledWith('Connected to the database');

        consoleLogSpy.mockRestore();
    });

    it('should handle database connection errors', async () => {
        const mockError = new Error('Connection failed');
        (mongoose.connect as jest.Mock).mockRejectedValueOnce(mockError);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('process.exit was called');
        });

        await expect(connectDB()).rejects.toThrow('process.exit was called');

        expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String));
        expect(consoleErrorSpy).toHaveBeenCalledWith('Database connection error:', mockError);

        consoleErrorSpy.mockRestore();
        processExitSpy.mockRestore();
    });
});

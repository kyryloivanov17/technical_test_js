import {HttpError} from "../../src/utils/httpError";

describe('HttpError', () => {
    it('should create an error with the correct status and default message', () => {
        const error = HttpError(400);

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Bad Request');
        expect(error.status).toBe(400);
    });

    it('should create an error with the correct status and custom message', () => {
        const error = HttpError(401, 'Custom Unauthorized Message');

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Custom Unauthorized Message');
        expect(error.status).toBe(401);
    });

    it('should return the correct default message from messagesList for other status codes', () => {
        const error = HttpError(404);

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Not Found');
        expect(error.status).toBe(404);
    });

    it('should handle missing messages for unknown status codes gracefully', () => {
        const error = HttpError(999);

        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("");
        expect(error.status).toBe(999);
    });

    it('should return the correct message from messagesList for a valid status code', () => {
        const error = HttpError(409);

        expect(error.message).toBe('Conflict');
        expect(error.status).toBe(409);
    });
});


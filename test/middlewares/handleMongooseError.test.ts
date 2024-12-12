import {handleMongooseError} from "../../src/middlewares";

describe('handleMongooseError', () => {

    const next = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set status to 409 for MongoServerError with code 11000 (duplicate key error)', () => {
        const error = { code: 11000, name: 'MongoServerError' } as any;
        const data = {};
        handleMongooseError(error, data, next);

        expect(error.status).toBe(409);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should set status to 400 for general error', () => {
        const error = { code: 123, name: 'SomeOtherError' } as any;
        const data = {};
        handleMongooseError(error, data, next);

        expect(error.status).toBe(400);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle error without code and name', () => {
        const error = {} as any;
        const data = {};
        handleMongooseError(error, data, next);

        expect(error.status).toBe(400);
        expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle error with only code 11000 but without MongoServerError name', () => {
        const error = { code: 11000, name: 'SomeOtherError' } as any;
        const data = {};
        handleMongooseError(error, data, next);

        expect(error.status).toBe(400);
        expect(next).toHaveBeenCalledWith(error);
    });

});

import {Request, Response} from "express";
import {validateBody} from "../../src/middlewares/validateBody";
import {HttpError} from "../../src/utils/httpError";
import Joi from "joi";

jest.mock('../../src/utils/httpError', () => ({
  HttpError: jest.fn(),
}));

describe('validateBody middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().min(18).required(),
  });

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it('should call next if body is valid', () => {
    req.body = {
      name: 'John',
      age: 30,
    };

    const middleware = validateBody(schema);
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next with error if body is invalid', () => {
    req.body = {
      name: 'John',
      age: 15,
    };

    const middleware = validateBody(schema);
    middleware(req as Request, res as Response, next);

    expect(HttpError).toHaveBeenCalledWith(400, '"age" must be greater than or equal to 18');
    expect(next).toHaveBeenCalled();
  });

  it('should call next with error if required fields are missing', () => {
    req.body = {
      name: 'John',
    };

    const middleware = validateBody(schema);
    middleware(req as Request, res as Response, next);

    expect(HttpError).toHaveBeenCalledWith(400, '"age" is required');
    expect(next).toHaveBeenCalled();
  });
});

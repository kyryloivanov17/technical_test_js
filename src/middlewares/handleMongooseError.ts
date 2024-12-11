type CustomError = (NativeError & { 
  code?: number; 
  name?: string; 
  status?: number; 
}) | null;

export const handleMongooseError = (
  error: CustomError & { code?: number; name?: string },
  data: any,
  next: (err?: CustomError) => void
): void => {
  if (error) {
    const { code, name } = error;
    error.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
  }
  next(error);
};
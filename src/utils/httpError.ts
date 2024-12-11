interface MessagesList {
  [statusCode: number]: string;
}

const messagesList: MessagesList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

interface HttpErrorType extends Error {
  status?: number;
}

export const HttpError = (status: number, message: string = messagesList[status]): HttpErrorType => {
  const error: HttpErrorType = new Error(message);
  error.status = status;
  return error;
};


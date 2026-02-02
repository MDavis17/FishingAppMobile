export interface RequestHeaders {
  headers?: any;
  method: RequestMethod;
  body?: string;
}

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  UPDATE = "UPDATE",
  PUT = "PUT",
}

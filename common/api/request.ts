import { getStoredAuthToken } from "common/auth/tokenStorage";
import { config, GooglePlacesApiBaseUrl, GooglePlacesAPIKey, GoogleWeatherApiBaseUrl, GoogleWeatherAPIKey } from "./config";
import { HTTP_STATUS } from "./constants";
import { RequestHeaders, RequestMethod } from "./types";

type UnauthorizedHandler = (() => void) | null;
let onUnauthorized: UnauthorizedHandler = null;

export function setOnUnauthorized(handler: UnauthorizedHandler) {
  onUnauthorized = handler;
}

export const internalUrlFormatter = (path: string) => {
  const cleanPath = path[0] === "/" ? path.substring(1) : path;
  let urlPath = `${config.api}${cleanPath}`;

  if (process.env.ENV === "LOCAL") {
    urlPath = `http://localhost:8000/${cleanPath}`;
  }

  return urlPath;
};

export const externalUrlFormatter = (
  externalBaseUrl: string,
  path: string,
  queryString?: string
) => {
  const cleanPath = path[0] === "/" ? path.substring(1) : path;
  return `${externalBaseUrl}${cleanPath}${
    queryString ? `?${queryString}` : ""
  }`;
};

export async function authenticatedFetch(
  url: string,
  options: { method: RequestMethod; body?: string } = {
    method: RequestMethod.GET,
  },
  token?: string
): Promise<{ ok: boolean; data: unknown; status: number }> {
  const requestOptions: RequestHeaders = { ...options };

  if (!requestOptions.headers) {
    requestOptions.headers = {};
  }

  const authToken = token ?? (await getStoredAuthToken());
  if (!authToken) {
    return {
      ok: false,
      data: { detail: "Not authenticated" },
      status: HTTP_STATUS.UNAUTHORIZED,
    };
  }

  requestOptions.headers.Authorization = `Bearer ${authToken}`;

  if (
    options.method !== RequestMethod.GET &&
    requestOptions.headers["Content-Type"] === undefined
  ) {
    requestOptions.headers["Content-Type"] = "application/json";
  }

  console.log(`Network: ${options.method} request to ${url}`, requestOptions);

  let response: Response;
  try {
    response = await fetch(internalUrlFormatter(url), requestOptions);
  } catch (networkError) {
    console.error(`Network: Fetch failed for ${url}`, networkError);
    throw networkError;
  }

  console.log(`Network: Received ${url}`, response);

  if (
    response.status === HTTP_STATUS.UNAUTHORIZED ||
    response.status === HTTP_STATUS.FORBIDDEN
  ) {
    onUnauthorized?.();
  }

  let responseJson: unknown;
  try {
    responseJson = await response.json();
  } catch (parseError) {
    console.error(`Network: Failed to parse JSON response for ${url}`, parseError);
    return {
      ok: false,
      data: { detail: "Invalid response from server" },
      status: response.status,
    };
  }

  return {
    ok: response.status === HTTP_STATUS.OK,
    data: responseJson,
    status: response.status,
  };
}

export async function unauthenticatedFetch(
  url: string,
  options: { method: RequestMethod; body?: string } = {
    method: RequestMethod.GET,
  }
) {
  const requestOptions: RequestHeaders = { ...options };

  if (!requestOptions.headers) {
    requestOptions.headers = {};
  }

  if (
    options.method !== RequestMethod.GET &&
    requestOptions.headers["Content-Type"] === undefined
  ) {
    requestOptions.headers["Content-Type"] = "application/json";
  }

  console.log(`Network: ${options.method} request to ${url}`, requestOptions);

  let response = await fetch(internalUrlFormatter(url), requestOptions);

  console.log(`Network: Received ${url}`, response);

  // potential offline solution ideas
  //   if (!online && response.status === HTTP_STATUS.OK) {
  //     getRequestStore().dispatch({
  //       type: ACTIONS.CONNECTED,
  //     });
  //   }

  const responseJson = await response.json();
  return { ok: response.ok, data: responseJson, status: response.status };
}

export async function googlePlacesFetch(
  url: string,
  queryString: string,
  options: { method: RequestMethod; body?: string } = {
    method: RequestMethod.GET,
  }
) {
  const requestOptions: RequestHeaders = { ...options };

  if (!requestOptions.headers) {
    requestOptions.headers = {};
  }

  if (
    options.method !== RequestMethod.GET &&
    requestOptions.headers["Content-Type"] === undefined
  ) {
    requestOptions.headers["Content-Type"] = "application/json";
  }

  console.log(`Network: ${options.method} request to ${url}`, requestOptions);

  let response = await fetch(
    externalUrlFormatter(
      GooglePlacesApiBaseUrl,
      url,
      `${queryString}&key=${GooglePlacesAPIKey}`
    ),
    requestOptions
  );

  console.log(`Network: Received ${url}`, response);

  const responseJson = await response.json();
  return { ok: response.status === HTTP_STATUS.OK, data: responseJson };
}

export async function googleWeatherFetch(
  url: string,
  queryString: string,
  options: { method: RequestMethod; body?: string } = {
    method: RequestMethod.GET,
  }
) {
  const requestOptions: RequestHeaders = { ...options };

  if (!requestOptions.headers) {
    requestOptions.headers = {};
  }

  if (
    options.method !== RequestMethod.GET &&
    requestOptions.headers["Content-Type"] === undefined
  ) {
    requestOptions.headers["Content-Type"] = "application/json";
  }

  console.log(`Network: ${options.method} request to ${url}`, requestOptions);

  let response = await fetch(
    externalUrlFormatter(
      GoogleWeatherApiBaseUrl,
      url,
      `${queryString}&key=${GoogleWeatherAPIKey}`
    ),
    requestOptions
  );

  console.log(`Network: Received ${url}`, response);

  const responseJson = await response.json();
  return { ok: response.status === HTTP_STATUS.OK, data: responseJson };
}

import { config } from "./config";
import { HTTP_STATUS } from "./constants";
import { RequestHeaders, RequestMethod } from "./types";

export const urlFormatter = (path: string) => {
  const cleanPath = path[0] === "/" ? path.substring(1) : path;
  let urlPath = `${config.api}${cleanPath}`;

  if (process.env.ENV === "LOCAL") {
    urlPath = `http://api.local.trainheroic.com:8888/${cleanPath}`;
  }

  return urlPath;
};

//* NO AUTHENTICATION YET *//
// export async function authenticatedFetch(
//     url,
//     options: { method: string, body?: string } = { method: 'GET' }
// ) {
//     const requestOptions = { ...options };

//     if (!requestOptions.headers) {
//         requestOptions.headers = {};
//     }
//     requestOptions.headers['Session-Token'] = session.session_id;

//     requestOptions.headers[
//         'X-Mobile-App-Version'
//     ] = `${DeviceInfo.getVersion()}`;

//     if (
//         options.method !== 'GET' &&
//         requestOptions.headers['Content-Type'] === undefined
//     ) {
//         requestOptions.headers['Content-Type'] = 'application/json';
//     }

//     const response = await fetch(urlFormatter(url), requestOptions);

//     // If we think we are offline, but got a proper response from a request...
//     if (!online && response.status === HTTP_STATUS.OK) {
//         getRequestStore().dispatch({
//             type: ACTIONS.CONNECTED,
//         });
//     }

//     if (response.status === HTTP_STATUS.SERVICE_UNAVAILABLE) {
//         setTimeout(() => {
//             getRequestStore().dispatch({
//                 type: ACTIONS.MAINTENANCE_MODE_ON,
//             });
//         });

//         throw 'Maintenance Mode Detected';
//     } else if (
//         inMaintenanceMode &&
//         response.status !== HTTP_STATUS.SERVICE_UNAVAILABLE
//     ) {
//         getRequestStore().dispatch({
//             type: ACTIONS.MAINTENANCE_MODE_OFF,
//         });
//     }

//     if (response.status === HTTP_STATUS.FORBIDDEN) {
//         getAuthStore().dispatch({
//             type: AUTH_ACTIONS.LOGOUT,
//         });
//         reset('Welcome', {});
//         return;
//     }

//     // Make a best effort to parse the data as JSON, if not just return the raw text.
//     const responseText = await response.text();
//     try {
//         const newResponse = JSON.parse(responseText);
//         Object.defineProperty(newResponse, 'hasHttpError', {
//             value: response.status !== HTTP_STATUS.OK,
//             enumerable: false,
//             writable: false,
//         });

//         return newResponse;
//     } catch (e) {
//         Object.defineProperty(response, 'hasHttpError', {
//             value: response.status !== HTTP_STATUS.OK,
//             enumerable: false,
//             writable: false,
//         });
//         Object.defineProperty(response, 'errorText', {
//             value: responseText || 'Unknown Error',
//             enumerable: false,
//             writable: false,
//         });
//         return response;
//     }
// }

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

  let response = await fetch(urlFormatter(url), requestOptions);

  console.log(`Network: Received ${url}`, response);

  // potential offline solution ideas
  //   if (!online && response.status === HTTP_STATUS.OK) {
  //     getRequestStore().dispatch({
  //       type: ACTIONS.CONNECTED,
  //     });
  //   }

  const responseJson = await response.json();
  return { ok: response.status === HTTP_STATUS.OK, data: responseJson };
}

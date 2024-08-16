"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * Creates an Axios instance configured with the base URL for Binance API and default headers.
 *
 * @type {AxiosInstance}
 */
var apiClient = _axios["default"].create({
  baseURL: "https://api.binance.com",
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Response interceptor to log errors and reject the promise if the request fails.
 *
 * @param {AxiosResponse} response - The successful response object.
 * @param {AxiosError} error - The error object that contains details about the error.
 * @returns {Promise<AxiosResponse>} The original response if successful, or a rejected promise if an error occurs.
 */
apiClient.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  console.error("API error:", error.message);
  return Promise.reject(error);
});
var _default = exports["default"] = apiClient;
//# sourceMappingURL=apiClient.js.map
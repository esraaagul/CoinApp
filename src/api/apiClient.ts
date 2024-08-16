import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

/**
 * Creates an Axios instance configured with the base URL for Binance API and default headers.
 *
 * @type {AxiosInstance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.binance.com",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor to log errors and reject the promise if the request fails.
 *
 * @param {AxiosResponse} response - The successful response object.
 * @param {AxiosError} error - The error object that contains details about the error.
 * @returns {Promise<AxiosResponse>} The original response if successful, or a rejected promise if an error occurs.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("API error:", error.message);
    return Promise.reject(error);
  }
);

export default apiClient;

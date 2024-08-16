import { useState, useEffect } from "react";
import { debounce } from "lodash";

/**
 * A custom React hook that establishes a WebSocket connection to Binance's ticker stream
 * and returns the latest prices for a list of specified cryptocurrency symbols.
 *
 * @param {string[]} symbols - An array of cryptocurrency symbols to track (e.g., ['BTCUSDT', 'ETHUSDT']).
 * @returns {Object<string, number>} An object where the keys are the symbols and the values are the latest prices.
 */
const useBinanceTicker = (symbols) => {
  const [prices, setPrices] = useState({});

  /**
   * Creates a WebSocket connection to the specified URL and handles incoming messages
   * to update the cryptocurrency prices.
   *
   * @param {string} url - The WebSocket URL to connect to.
   * @returns {WebSocket} The created WebSocket instance.
   */
  const createWebSocket = (url) => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    /**
     * Handles incoming WebSocket messages with debounce to prevent excessive updates.
     *
     * @param {MessageEvent} event - The WebSocket message event.
     */
    const handleWebSocketMessage = debounce((event) => {
      const message = JSON.parse(event.data);
      const data = message.data;
      const symbol = data.s; // Symbol name
      const price = parseFloat(data.c); // Current price

      setPrices((prev) => ({
        ...prev,
        [symbol]: price,
      }));
    }, 60000); // Debounce interval: 60 seconds

    ws.onmessage = handleWebSocketMessage;

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      ws.close();
    };

    ws.onclose = () => {
      console.warn("WebSocket connection closed. Reconnecting...");
      reconnect(url);
    };

    return ws;
  };

  /**
   * Reconnects to the WebSocket server after a specified delay.
   *
   * @param {string} url - The WebSocket URL to reconnect to.
   * @param {number} [delay=5000] - The delay in milliseconds before attempting to reconnect.
   */
  const reconnect = (url, delay = 5000) => {
    setTimeout(() => {
      createWebSocket(url);
    }, delay);
  };

  useEffect(() => {
    if (symbols.length === 0) {
      return;
    }

    const streams = symbols
      .map((sym) => `${sym.toLowerCase()}@ticker`)
      .join("/");
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    const ws = createWebSocket(wsUrl);

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [symbols]);

  return prices;
};

export default useBinanceTicker;

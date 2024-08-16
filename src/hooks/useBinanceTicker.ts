import { useState, useEffect } from "react";

interface Prices {
  [symbol: string]: number;
}

const useBinanceTicker = (symbols: string[]): Prices => {
  const [prices, setPrices] = useState<Prices>({});

  const createWebSocket = (url: string): WebSocket => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
    };

    const handleWebSocketMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const data = message.data;
      const symbol = data.s;
      const price = parseFloat(data.c);

      setPrices((prev) => ({
        ...prev,
        [symbol]: price,
      }));
    };

    ws.onmessage = handleWebSocketMessage;

    ws.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
      ws.close();
    };

    ws.onclose = () => {
      console.warn("WebSocket connection closed. Reconnecting...");
      reconnect(url);
    };

    return ws;
  };

  const reconnect = (url: string, delay = 5000) => {
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

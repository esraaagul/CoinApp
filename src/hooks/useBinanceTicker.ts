import { useState, useEffect } from "react";
import { debounce } from "lodash";

const useBinanceTicker = (symbols: string[]) => {
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const createWebSocket = (url: string) => {
    const ws = new WebSocket(url);

    // WebSocket bağlantısı kurulduğunda
    ws.onopen = () => {
      console.log("WebSocket bağlantısı başarılı.");
    };

    // Debounce uygulanan mesaj işleyici
    const handleWebSocketMessage = debounce((event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const data = message.data;
      const symbol = data.s; // Sembol adı
      const price = parseFloat(data.c); // Güncel fiyat

      setPrices((prev) => ({
        ...prev,
        [symbol]: price,
      }));
    }, 30000);

    ws.onmessage = handleWebSocketMessage;

    ws.onerror = (error) => {
      console.error("WebSocket hatası:", error);
      ws.close();
    };

    ws.onclose = () => {
      console.warn("WebSocket bağlantısı kapandı. Yeniden bağlanıyor...");
      reconnect(url);
    };

    return ws;
  };

  const reconnect = (url: string, delay: number = 5000) => {
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
        ws.close(); // WebSocket bağlantısını kapatma işlemi
      }
    };
  }, [symbols]);

  return prices;
};

export default useBinanceTicker;

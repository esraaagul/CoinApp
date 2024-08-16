import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DataTable from "./DataTable";

// Mock API Client
jest.mock("../api/apiClient", () => ({
  get: jest.fn().mockResolvedValue({
    data: [
      {
        symbol: "BTCUSDT",
        lastPrice: "60000.00",
        priceChangePercent: "2.00",
        openPrice: "59000.00",
        closePrice: "60000.00",
        highPrice: "60500.00",
        lowPrice: "58000.00",
        volume: "1000.0",
        quoteVolume: "60000000.0",
      },
      // Add more mock data if needed
    ],
  }),
}));

// Mock useBinanceTicker Hook
jest.mock("../hooks/useBinanceTicker", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    BTCUSDT: 60000.0,
  }),
}));

const queryClient = new QueryClient();

describe("DataTable", () => {
  it("renders loading state initially", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DataTable />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders the data table with correct data", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DataTable />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("BTC / USDT")).toBeInTheDocument();
      expect(screen.getByText("60,000.00 USDT")).toBeInTheDocument();
      expect(screen.getByText("2.00%")).toBeInTheDocument();
    });
  });

  it("renders error message on API error", async () => {
    // Mock API error
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error in test output
    const apiClient = require("../api/apiClient");
    apiClient.get.mockRejectedValueOnce(new Error("API error"));

    render(
      <QueryClientProvider client={queryClient}>
        <DataTable />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/i)).toBeInTheDocument();
    });
  });
});

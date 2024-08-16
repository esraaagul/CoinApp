import { useState, useEffect } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { getSymbolLogo } from "../utils/utils";
import Sparkline from "./Sparkline";
import useBinanceTicker from "../hooks/useBinanceTicker";
import apiClient from "../api/apiClient";
import coinData from "../data/coinData.json";
import { Data, CoinInfo } from "../interfaces/dataInterface";

const coinMapping: Record<string, CoinInfo> = coinData as Record<
  string,
  CoinInfo
>;

const formatNumber = (value: number): string => {
  const parts = value.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(".");
};

const DataTable: React.FC = () => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedData, setPaginatedData] = useState<Data[]>([]);
  const [currentSymbols, setCurrentSymbols] = useState<string[]>([]);

  const { data, error, isLoading } = useQuery<Data[], Error>({
    queryKey: ["tickerData"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v3/ticker/24hr");
      const usdtPairs = response.data.filter((item: Data) =>
        item.symbol.endsWith("USDT")
      );
      const sortedByVolume = usdtPairs.sort(
        (a: Data, b: Data) =>
          parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)
      );
      return sortedByVolume.slice(0, 100);
    },
    initialData: [], // Ensure that `data` is always an array, not `undefined`
  });

  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const currentPageData = data.slice(start, end);
      setPaginatedData(currentPageData);
      const symbols = currentPageData.map((item) => item.symbol);
      setCurrentSymbols(symbols);
    }
  }, [data, page]);

  const prices = useBinanceTicker(currentSymbols);

  const columns = [
    {
      accessorKey: "symbol",
      header: "Crypto",
      cell: ({ row }: { row: { original: Data } }) => {
        const symbol = row.original.symbol;
        const coinInfo = coinMapping[symbol];
        const token = symbol.replace("USDT", "");
        const name = coinInfo ? coinInfo.name : "";

        return (
          <div className="symbol-cell">
            <img
              src={getSymbolLogo(token)}
              alt={token}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/public/no-image.svg";
              }}
            />
            <div className="symbol-container">
              <div className="symbol-text">
                {token} <span className="symbol-currency"> / USDT</span>
              </div>
              <div className="symbol-name">{name}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "lastPrice",
      header: "Price",
      cell: ({ row }: { row: { original: Data } }) => {
        const symbol = row.original.symbol;
        const currentPrice = prices[symbol];
        const displayedPrice =
          currentPrice || parseFloat(row.original.lastPrice);
        return (
          <div>
            {formatNumber(displayedPrice)}{" "}
            <span className="symbol-currency">USDT</span>
          </div>
        );
      },
    },
    {
      accessorKey: "marketCap",
      header: "Market Value",
      cell: ({ row }: { row: { original: Data } }) => {
        const symbol = row.original.symbol;
        const currentPrice = prices[symbol];
        const lastPrice = currentPrice || parseFloat(row.original.lastPrice);
        const volume = parseFloat(row.original.volume);

        const marketCap =
          !isNaN(lastPrice) && !isNaN(volume)
            ? formatNumber(lastPrice * volume)
            : "N/A";
        return (
          <div>
            {marketCap} <span className="symbol-currency">USDT</span>
          </div>
        );
      },
    },
    {
      accessorKey: "priceChangePercent",
      header: "24h Change",
      cell: ({ row }: { row: { original: Data } }) => (
        <span
          className={`price-change ${
            parseFloat(row.original.priceChangePercent) > 0 ? "positive" : ""
          }`}
        >
          {parseFloat(row.original.priceChangePercent).toFixed(2)}%
        </span>
      ),
    },
    {
      accessorKey: "sparkline",
      header: "",
      cell: ({ row }: { row: { original: Data } }) => {
        const sparklineData = [
          parseFloat(row.original.openPrice),
          parseFloat(row.original.lastPrice),
          parseFloat(row.original.highPrice),
          parseFloat(row.original.lowPrice),
        ];

        if (sparklineData.some(isNaN)) {
          return <span>No Data</span>;
        }

        const change = parseFloat(row.original.priceChangePercent);

        return <Sparkline data={sparklineData} change={change} />;
      },
    },
  ];

  const getPaginationNumbers = () => {
    const maxPageDisplay = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPageDisplay) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      const startPage = Math.max(1, page - 2);
      const endPage = Math.min(totalPages - 1, page + 2);

      if (startPage > 1) {
        pages.push("...");
      }

      for (let i = startPage; i < endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages - 1);
    }

    return pages;
  };

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="pagination"
        style={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          style={{ color: "#ccc" }}
        >
          {"<"}
        </button>
        {getPaginationNumbers().map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span key={index}>...</span>
          ) : (
            <button
              key={index}
              onClick={() => setPage(Number(pageNumber))}
              style={{
                fontWeight: page === pageNumber ? "bold" : "normal",
                borderColor: page === pageNumber ? "#007bff" : "#ccc",
                color: page === pageNumber ? "#007bff" : "#ccc",
              }}
            >
              {Number(pageNumber) + 1}
            </button>
          )
        )}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          style={{ color: "#ccc" }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default DataTable;

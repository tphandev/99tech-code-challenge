import { renderHook, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { useTokenPrices } from "../useTokenPrices";

describe("useTokenPrices", () => {
  // Mock response data
  const mockTokenPrices = [
    { currency: "BTC", date: "2023-01-01T00:00:00Z", price: 50000 },
    { currency: "BTC", date: "2023-01-02T00:00:00Z", price: 55000 },
    { currency: "ETH", date: "2023-01-01T00:00:00Z", price: 2000 },
    { currency: "USDT", date: "2023-01-01T00:00:00Z", price: 1 },
    { currency: "ZERO", date: "2023-01-01T00:00:00Z", price: 0 },
  ];

  // Set up fetch mock
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test("should initialize with loading state", () => {
    const { result } = renderHook(() => useTokenPrices());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.prices).toEqual({});
    expect(result.current.tokenOptions).toEqual([]);
  });

  test("should fetch and process token prices", async () => {
    // Mock successful response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenPrices,
    } as Response);

    const { result } = renderHook(() => useTokenPrices());

    // Wait for the async operation to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith(
      "https://interview.switcheo.com/prices.json"
    );

    // Verify loading and error states
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    // Verify the processed data
    // Should pick the most recent price for BTC (55000)
    // Should filter out ZERO (price = 0)
    expect(result.current.prices).toEqual({
      BTC: 55000,
      ETH: 2000,
      USDT: 1,
    });

    // Verify tokenOptions are generated correctly
    expect(result.current.tokenOptions).toEqual([
      {
        symbol: "BTC",
        icon: "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/BTC.svg",
      },
      {
        symbol: "ETH",
        icon: "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg",
      },
      {
        symbol: "USDT",
        icon: "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/USDT.svg",
      },
    ]);
  });

  test("should handle network error", async () => {
    // Mock network error
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useTokenPrices());

    // Wait for the async operation to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify error handling
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to load token prices");
    expect(result.current.prices).toEqual({});
    expect(result.current.tokenOptions).toEqual([]);
  });

  test("should handle non-OK response", async () => {
    // Mock non-ok response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
    } as Response);

    const { result } = renderHook(() => useTokenPrices());

    // Wait for the async operation to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify error handling
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Failed to load token prices");
    expect(result.current.prices).toEqual({});
    expect(result.current.tokenOptions).toEqual([]);
  });

  test("should handle empty response", async () => {
    // Mock empty response
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    const { result } = renderHook(() => useTokenPrices());

    // Wait for the async operation to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify correct handling of empty data
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.prices).toEqual({});
    expect(result.current.tokenOptions).toEqual([]);
  });

  test("should filter out tokens with zero or negative price", async () => {
    // Mock response with zero and negative prices
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { currency: "BTC", date: "2023-01-01T00:00:00Z", price: 50000 },
        { currency: "ZERO", date: "2023-01-01T00:00:00Z", price: 0 },
        { currency: "NEG", date: "2023-01-01T00:00:00Z", price: -10 },
      ],
    } as Response);

    const { result } = renderHook(() => useTokenPrices());

    // Wait for the async operation to complete
    await waitFor(() => expect(result.current.loading).toBe(false));

    // Verify only positive prices are kept
    expect(result.current.prices).toEqual({ BTC: 50000 });
    expect(result.current.tokenOptions).toHaveLength(1);
    expect(result.current.tokenOptions[0].symbol).toBe("BTC");
  });
});

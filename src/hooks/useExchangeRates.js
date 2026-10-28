import { useCallback, useEffect, useState } from "react";

const API_URL = "https://api.frankfurter.dev/v1";

/** Fetches the latest rates for one base currency. */
export default function useExchangeRates(baseCurrency) {
  const [data, setData] = useState({ rates: {}, date: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const refetch = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    async function getRates() {
      setLoading(true); setError("");
      try {
        const response = await fetch(`${API_URL}/latest?base=${baseCurrency}`, { signal: controller.signal });
        if (!response.ok) throw new Error("The exchange-rate service is unavailable.");
        const result = await response.json();
        setData({ rates: result.rates ?? {}, date: result.date ?? "" });
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message || "Could not load exchange rates.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }
    getRates();
    return () => controller.abort();
  }, [baseCurrency, refreshKey]);
  return { ...data, loading, error, refetch };
}

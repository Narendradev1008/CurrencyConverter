import { useEffect, useState } from "react";
const API_URL = "https://api.frankfurter.dev/v1";
const toDateString = (date) => date.toISOString().slice(0, 10);

/** Fetches the last 30 days of a single currency pair for the mini chart. */
export default function useHistoricalRates(from, to) {
  const [state, setState] = useState({ points: [], loading: true, error: "" });
  useEffect(() => {
    if (from === to) return undefined;
    const controller = new AbortController();
    const end = new Date(); const start = new Date(); start.setDate(end.getDate() - 30);
    async function getHistory() {
      setState({ points: [], loading: true, error: "" });
      try {
        const url = `${API_URL}/${toDateString(start)}..${toDateString(end)}?base=${from}&symbols=${to}`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Historical data is unavailable.");
        const result = await response.json();
        const points = Object.entries(result.rates ?? {}).map(([date, rates]) => ({ date, value: rates[to] })).filter((point) => Number.isFinite(point.value));
        setState({ points, loading: false, error: "" });
      } catch (requestError) {
        if (requestError.name !== "AbortError") setState({ points: [], loading: false, error: "Historical data is unavailable." });
      }
    }
    getHistory(); return () => controller.abort();
  }, [from, to]);
  return from === to ? { points: [], loading: false, error: "" } : state;
}

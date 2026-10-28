# Currency Converter

A beginner-friendly React and Vite currency converter with live rates, searchable currencies, swapping, browser persistence, responsive Tailwind styling, and a 30-day chart.

## Setup

1. Run `npm install`.
2. Run `npm run dev` and open Vite's printed URL.
3. Use `npm run build` for a production bundle and `npm run lint` for linting.

No API key is required. The app uses the public [Frankfurter API](https://frankfurter.dev/), so internet access is required.

## File guide

| File | Purpose |
| --- | --- |
| `src/main.jsx` | Mounts React and imports the Tailwind entry CSS. |
| `src/index.css` | Imports Tailwind CSS. |
| `src/App.jsx` | Owns converter state, connects hooks/components, derives the result, saves selections, and lays out the page. |
| `src/components/InputBox.jsx` | Reusable amount-and-currency field used on both sides. |
| `src/components/CurrencySelector.jsx` | Reusable searchable currency menu, with names supplied by `Intl.DisplayNames`. |
| `src/components/ExchangeChart.jsx` | Dependency-free SVG line chart with loading/error/empty states. |
| `src/components/index.js` | Component export barrel. |
| `src/hooks/useExchangeRates.js` | Fetches current rates, with cancellation, loading, errors, date, and retry support. |
| `src/hooks/useHistoricalRates.js` | Fetches the selected pair's 30-day history for the chart. |

## State, calls, and data flow

`App` stores `amount` (editable text), `from`, `to`, and the initial `recent` pair. `readRecentSelection` reads `currency-converter-recent` from `localStorage`, falling back to USD → INR. An effect writes the current pair whenever either currency changes.

`useExchangeRates(from)` calls `https://api.frankfurter.dev/v1/latest?base=FROM` and returns `rates`, `date`, `loading`, `error`, and `refetch`. `App` derives the currency list and calculates `amount × rates[to]`; the result is deliberately not state, so it cannot become stale after a swap or refresh. A same-currency conversion uses a rate of 1.

`useHistoricalRates(from, to)` calls `https://api.frankfurter.dev/v1/START..END?base=FROM&symbols=TO`, converts date-keyed rates into points, and `ExchangeChart` scales those values to an SVG line. If the API does not provide history, the UI reports that rather than inventing data. Both fetch hooks use `AbortController` to cancel obsolete requests.

`InputBox` lifts user changes to `App`; `CurrencySelector` filters the supplied codes locally while typing. The swap button exchanges `from` and `to`, causing the derived output and hooks to update automatically.

## Notes

- Rates are current API values, not guaranteed real-time trading prices.
- “Recent selection” means the last **from/to pair** saved only in this browser. Amounts and rate responses are not stored.
- The historical chart appears when the selected pair has API observations.

## Common interview questions

### Why make a custom hook?

It separates asynchronous requests, cancellation, and loading/error handling from UI and makes the logic reusable.

### Why not store converted amount in state?

It is derived from the input, selected currencies, and fetched rate. Deriving prevents synchronization bugs.

### How are stale responses prevented?

Each hook aborts the previous request in its cleanup when inputs change or the component unmounts.

### Why use localStorage?

It keeps the last pair convenient on the same device without requiring accounts or a backend.

### Why SVG rather than a chart library?

This small visual needs no extra dependency. A larger analytics UI could benefit from a library with axes, tooltips, and richer accessibility.

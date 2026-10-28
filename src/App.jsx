import { useEffect, useMemo, useState } from "react";
import { InputBox } from "./components";
import ExchangeChart from "./components/ExchangeChart";
import useExchangeRates from "./hooks/useExchangeRates";
import useHistoricalRates from "./hooks/useHistoricalRates";
import bg from "./assets/money.jpg";

const STORAGE_KEY = "currency-converter-recent";
const FALLBACK_CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CHF", "CNY"];
function readRecentSelection() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { from: "USD", to: "INR" }; } catch { return { from: "USD", to: "INR" }; } }

function App() {
  const [recent] = useState(readRecentSelection);
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState(recent.from);
  const [to, setTo] = useState(recent.to);
  const { rates, date, loading, error, refetch } = useExchangeRates(from);
  const history = useHistoricalRates(from, to);
  const currencies = useMemo(() => [...new Set([from, to, ...Object.keys(rates).map((code) => code.toUpperCase()), ...FALLBACK_CURRENCIES])].sort(), [rates, from, to]);
  const rate = from === to ? 1 : rates[to];
  const numericAmount = Number(amount);
  const convertedAmount = Number.isFinite(numericAmount) && rate ? numericAmount * rate : 0;
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ from, to })); }, [from, to]);
  function swapCurrencies() { setFrom(to); setTo(from); }

  return <main className="min-h-screen bg-slate-950 bg-cover bg-center px-4 py-10 sm:py-16" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,.78), rgba(15,23,42,.86)), url(${bg})` }}>
    <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl sm:p-8">
      <header className="mb-7"><p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Live currency tool</p><h1 className="mt-1 text-3xl font-bold text-slate-900">Currency converter</h1><p className="mt-2 text-sm text-slate-500">Search a currency, enter an amount, and see the latest available rate.</p></header>
      {error ? <div className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error} <button type="button" onClick={refetch} className="font-bold underline">Try again</button></div> : null}
      <form onSubmit={(event) => event.preventDefault()}>
        <InputBox label="You send" amount={amount} currencyOptions={currencies} onCurrencyChange={setFrom} onAmountChange={setAmount} selectCurrency={from} />
        <div className="relative my-4 border-t border-slate-200"><button type="button" onClick={swapCurrencies} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-blue-600 px-3 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700" aria-label="Swap currencies">⇅</button></div>
        <InputBox label="Recipient gets" amount={loading ? "Loading…" : rate ? convertedAmount.toFixed(2) : "—"} currencyOptions={currencies} onCurrencyChange={setTo} selectCurrency={to} amountDisable />
      </form>
      <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-950">{loading ? "Updating exchange rate…" : <><strong>1 {from} = {rate ? rate.toFixed(4) : "—"} {to}</strong>{date ? <span className="block pt-1 text-blue-700">Rate date: {date}</span> : null}</>}</div>
      <ExchangeChart {...history} from={from} to={to} />
      <p className="mt-5 text-center text-xs text-slate-400">Latest and historical rates supplied by Frankfurter. Recent currencies are saved only in this browser.</p>
    </div>
  </main>;
}
export default App;

import { useId } from "react";
import CurrencySelector from "./CurrencySelector";
function InputBox({
  label,
  className = "",
  amount,
  onAmountChange,
  onCurrencyChange,
  currencyOptions = [],
  selectCurrency = "usd",
  amountDisable = false,
  currencyDisable = false,
}) {
  const amountInputId = useId();
  return (
    <div className={`bg-white p-3 rounded-lg text-sm flex ${className}`}>
      <div className="w-1/2">
        <label
          className="text-black/40 mb-2 inline-block"
          htmlFor={amountInputId}
        >
          {label}
        </label>
        <input
          className="outline-none w-full bg-transparent py-1.5"
          type={amountDisable ? "text" : "number"}
          placeholder="Amount"
          id={amountInputId}
          value={amount}
          disabled={amountDisable}
          onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
        />
      </div>
      <div className="w-1/2 flex flex-wrap justify-end text-right">
        <p className="text-black/40 mb-2 w-full">Currency Type</p>
        <CurrencySelector value={selectCurrency} currencies={currencyOptions} onChange={onCurrencyChange} disabled={currencyDisable} />
      </div>
    </div>
  );
}

export default InputBox;

import { useState, type ReactNode } from "react";
import { type Currency, CURRENCY_RATES, CURRENCY_SYMBOLS } from "@/lib/types";
import { CurrencyContext } from "./currency-hooks";

export { useCurrency } from "./currency-hooks";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const stored = localStorage.getItem("ws-currency");
    return (stored as Currency) || "INR";
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("ws-currency", c);
  };

  const convert = (priceINR: number) => {
    return Math.round(priceINR * CURRENCY_RATES[currency] * 100) / 100;
  };

  const symbol = CURRENCY_SYMBOLS[currency];

  const format = (priceINR: number) => {
    const converted = convert(priceINR);
    if (currency === "INR") {
      return `₹${converted.toLocaleString("en-IN")}`;
    }
    return `${symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, symbol, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

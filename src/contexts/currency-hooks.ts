
import { createContext, useContext } from "react";
import { type Currency } from "@/lib/types";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (priceINR: number) => number;
  symbol: string;
  format: (priceINR: number) => string;
}

export const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

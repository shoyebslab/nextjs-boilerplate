export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  BDT: "৳",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
  BTC: "₿",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  CNY: "¥",
  KRW: "₩",
  SGD: "S$",
  THB: "฿",
  VND: "₫",
  SAR: "﷼",
  AED: "د.إ",
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: "Dollars",
  EUR: "Euros",
  GBP: "Pounds",
  BDT: "Taka",
  INR: "Rupees",
  PKR: "Rupees",
  NPR: "Rupees",
  LKR: "Rupees",
  CAD: "Dollars",
  AUD: "Dollars",
  SGD: "Dollars",
  AED: "Dirhams",
  SAR: "Riyals",
  QAR: "Riyals",
  OMR: "Rials",
  KWD: "Dinars",
  BHD: "Dinars",
  JPY: "Yen",
  CNY: "Yuan",
  HKD: "Dollars",
  NZD: "Dollars",
  CHF: "Francs",
  ZAR: "Rand",
  MYR: "Ringgits",
  THB: "Baht",
  IDR: "Rupiahs",
  PHP: "Pesos",
  VND: "Dong",
  KRW: "Won",
  RUB: "Rubles",
  BRL: "Reais",
  MXN: "Pesos",
  TRY: "Liras",
  EGP: "Pounds",
};

export interface CurrencyFormatOptions {
  currency?: string;
  showSymbol?: boolean;
  decimals?: number;
  primaryGroup?: number;
  secondaryGroup?: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
}

const formatWithCustomGrouping = (
  integerPart: string,
  primaryGroup?: number,
  secondaryGroup?: number,
  thousandSeparator: string = ","
): string => {
  if (!primaryGroup || !secondaryGroup || primaryGroup < 1 || secondaryGroup < 1) {
    return integerPart;
  }

  const chars = integerPart.split("");
  const groups: string[] = [];
  let index = chars.length;

  if (index <= primaryGroup) {
    return integerPart;
  }

  groups.unshift(chars.slice(index - primaryGroup, index).join(""));
  index -= primaryGroup;

  while (index > 0) {
    const start = Math.max(0, index - secondaryGroup);
    groups.unshift(chars.slice(start, index).join(""));
    index -= secondaryGroup;
  }

  return groups.join(thousandSeparator);
};

/**
 * Format any number into formatted currency string with symbol, precision, and custom grouping
 */
export function currencyFormatter(
  amount: number | string | null | undefined,
  options: CurrencyFormatOptions = {}
): string {
  if (amount === null || amount === undefined || amount === "" || isNaN(Number(amount))) {
    return "";
  }

  const {
    showSymbol = true,
    decimals = 2,
    primaryGroup,
    secondaryGroup,
    thousandSeparator = ",",
    decimalSeparator = ".",
    currency = "BDT",
  } = options;

  const symbol = CURRENCY_SYMBOLS[currency] || currency;

  try {
    const num = Number(amount);
    const isNegative = num < 0;
    const absValue = Math.abs(num);
    const fixed = absValue.toFixed(decimals);
    const [integerPart, decimalPart] = fixed.split(".");

    let groupedInteger: string;
    if (primaryGroup && secondaryGroup) {
      groupedInteger = formatWithCustomGrouping(
        integerPart,
        primaryGroup,
        secondaryGroup,
        thousandSeparator
      );
    } else {
      // Standard international 3-digit grouping
      groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    }

    const formattedAmount =
      decimals > 0
        ? `${groupedInteger}${decimalSeparator}${decimalPart}`
        : groupedInteger;

    const withSign = isNegative ? `-${formattedAmount}` : formattedAmount;

    return showSymbol ? `${symbol} ${withSign}` : withSign;
  } catch {
    return String(amount);
  }
}

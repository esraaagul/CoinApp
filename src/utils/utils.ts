/**
 * Returns the URL for the SVG logo of a given cryptocurrency symbol.
 * The symbol is converted to uppercase and then inserted into the URL.
 *
 * @param {string} symbol - The cryptocurrency symbol (e.g., 'btc', 'eth').
 * @returns {string} The URL string pointing to the SVG logo of the cryptocurrency.
 *
 * @example
 * // Returns the URL for the Bitcoin logo
 * const logoUrl = getSymbolLogo('btc');
 * // logoUrl: "https://cdn.bilira.co/symbol/svg/BTC.svg"
 */
export const getSymbolLogo = (symbol: string): string => {
  return `https://cdn.bilira.co/symbol/svg/${symbol.toUpperCase()}.svg`;
};

/**
 * Determines the color associated with a given percentage change value.
 * - Green for positive changes
 * - Red for negative changes
 * - Gray for neutral or zero change
 *
 * @param {string} change - The percentage change as a string (e.g., '0.5', '-0.2').
 * @returns {string} The color string representing the change ('green', 'red', or 'gray').
 *
 * @example
 * // Returns 'green' for a positive change
 * const color = getChangeColor('1.5');
 *
 * @example
 * // Returns 'red' for a negative change
 * const color = getChangeColor('-0.5');
 *
 * @example
 * // Returns 'gray' for a neutral change
 * const color = getChangeColor('0');
 */
export const getChangeColor = (change: string): string => {
  const changeValue = parseFloat(change);
  if (changeValue > 0) return "green";
  if (changeValue < 0) return "red";
  return "gray"; // For neutral cases
};

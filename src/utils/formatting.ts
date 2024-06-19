export const formatPrice = (value: number | null): string | null => {
    if (value === null) return null;
    if (value === 0) return "0";
    const formatted = value.toPrecision(2);

    // Convert scientific notation to fixed-point notation if necessary
    if (formatted.includes("e")) {
        const [base, exponent] = formatted.split("e");
        const exponentNumber = parseInt(exponent, 10);
        const number = parseFloat(base) * Math.pow(10, exponentNumber);

        if (exponentNumber < -4) {
            const decimalPlaces = Math.abs(exponentNumber) - 1;
            const significantPart = number.toFixed(Math.abs(exponentNumber) + 1).replace(/^-?0\.0*/, "");
            return `$0.0${decimalPlaces}${significantPart}`;
        }

        return number.toFixed(Math.max(0, -exponentNumber + 1));
    }

    return parseFloat(formatted).toString(); // Remove unnecessary trailing zeros
};

export const formatPriceChange = (value: number | null): string | null => {
    if (value === null) return null;
    const roundedValue = Math.round(value);
    const sign = roundedValue >= 0 ? "+" : "-";
    return `${sign}${Math.abs(roundedValue)}%`;
};

export const formatLargeNumber = (value: number | null): string | null => {
    if (value === null) return null;
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
        return `${(value / 1_000).toFixed(2)}K`;
    } else {
        return value.toFixed(2); // Ensure two decimal places for values below 1,000
    }
};

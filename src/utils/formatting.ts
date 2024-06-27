export const formatPrice = (value: number | null): string | null => {
    console.log("value", value);
    if (value === null) return null;
    if (value === 0) return "0";
    const subscriptDigits = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉",
        "₁₀", "₁₁", "₁₂", "₁₃", "₁₄", "₁₅", "₁₆", "₁₇", "₁₈", "₁₉", "₂₀",
    ];

    const formatted = value.toPrecision(2);

    const formatWithSubscripts = (num: string, leadingZeros: number): string => {
        const significantPart = num.replace(/^0+\.(0+)?/, "");
        console.log(num, significantPart);
        const subscriptPart = leadingZeros > 0 ? subscriptDigits[leadingZeros] : "";
        return `0.0${subscriptPart}${significantPart}`;
    };

    // Convert scientific notation to fixed-point notation if necessary
    if (formatted.includes("e")) {
        const [base, exponent] = formatted.split("e");

        const exponentNumber = parseInt(exponent, 10);

        const number = parseFloat(base) * Math.pow(10, exponentNumber);

        if (exponentNumber < -4) {
            const decimalPlaces = Math.abs(exponentNumber) - 1;

            const significantPart = number.toFixed(Math.abs(exponentNumber) + 1).replace(/^-?0\.0*/, "");

            return `0.0${subscriptDigits[decimalPlaces]}${significantPart}`;
        }

        return number.toFixed(Math.max(0, -exponentNumber + 1));
    }

    const [integerPart, decimalPart] = formatted.split(".");
    if (integerPart === "0" && decimalPart) {
        const leadingZeros = decimalPart.match(/^0+/)?.[0].length || 0;
        if (leadingZeros > 2) {
            return formatWithSubscripts(formatted, leadingZeros);
        }
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

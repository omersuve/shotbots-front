import React, { FC, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { MarketSentiment } from "types";

// Map enum values to descriptive string labels
const sentimentLabels: { [key in MarketSentiment]: string } = {
  [MarketSentiment.DOOMED]: "Doomed",
  [MarketSentiment.BEARISH]: "Bearish",
  [MarketSentiment.NEUTRAL]: "Neutral",
  [MarketSentiment.BULLISH]: "Bullish",
  [MarketSentiment.EUPHORIC]: "Euphoric",
};

// Define the marks for the slider using descriptive labels
const sliderMarks = [
  {
    value: MarketSentiment.DOOMED,
    label: sentimentLabels[MarketSentiment.DOOMED],
  },
  {
    value: MarketSentiment.BEARISH,
    label: sentimentLabels[MarketSentiment.BEARISH],
  },
  {
    value: MarketSentiment.NEUTRAL,
    label: sentimentLabels[MarketSentiment.NEUTRAL],
  },
  {
    value: MarketSentiment.BULLISH,
    label: sentimentLabels[MarketSentiment.BULLISH],
  },
  {
    value: MarketSentiment.EUPHORIC,
    label: sentimentLabels[MarketSentiment.EUPHORIC],
  },
];

// Slider Component with Descriptive Labels
const CustomSlider: FC<{
  value: MarketSentiment;
  onChange: (value: number) => void;
  disabled: boolean;
}> = ({ value, onChange, disabled }) => {
  return (
    <Box
      sx={{
        width: "100%", // Ensure the slider takes the full width of the container
        overflow: "visible", // Hide overflow to prevent label text from spilling out
        padding: "12px",
      }}
    >
      <Slider
        aria-labelledby="discrete-slider"
        value={value}
        min={MarketSentiment.DOOMED}
        max={MarketSentiment.EUPHORIC}
        step={1}
        marks={sliderMarks}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => sentimentLabels[value as MarketSentiment]}
        onChange={(_, newValue) => onChange(newValue as number)}
        disabled={disabled}
        sx={{
          "& .MuiSlider-markLabel": {
            fontSize: "8px", // Smaller font size for the labels to fit within the box
            overflow: "visible", // Prevent overflow
            textOverflow: "ellipsis", // Truncate text with ellipsis if it overflows
            margin: "0", // Remove default margin to reduce spacing
          },
          "& .MuiSlider-mark": {
            height: "4px", // Reduce height of the tick marks
            width: "2px", // Reduce width of the tick marks
            backgroundColor: "#bfbfbf", // Subtle color for tick marks
          },
          "& .MuiSlider-thumb": {
            width: "12px", // Set thumb width
            height: "12px", // Set thumb height
          },
          "& .MuiSlider-valueLabel": {
            fontSize: "6px", // Smaller font size for value labels
            transform: "translateY(-80%)", // Move value label up
          },
          "& .MuiSlider-track": {
            height: "4px", // Decrease track height
          },
          "& .MuiSlider-rail": {
            height: "4px", // Decrease rail height
          },
        }}
      />
    </Box>
  );
};

export default CustomSlider;

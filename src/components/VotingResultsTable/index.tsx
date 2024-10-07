import React, { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { defaultVoteValues, MarketSentiment } from "types";

// Define the prop types for the component
interface VotingResultsTableProps {
  votes: { [key in MarketSentiment]: number }; // Pass the votes directly as a prop
  userVote: MarketSentiment | null; // Track the user's vote as a prop
}

// Define the desired order of vote values as descriptive labels
const voteValueOrder = [
  MarketSentiment.DOOMED,
  MarketSentiment.BEARISH,
  MarketSentiment.NEUTRAL,
  MarketSentiment.BULLISH,
  MarketSentiment.EUPHORIC,
];

// Map the enum values to descriptive string labels
const sentimentLabels: { [key in MarketSentiment]: string } = {
  [MarketSentiment.DOOMED]: "Doomed",
  [MarketSentiment.BEARISH]: "Bearish",
  [MarketSentiment.NEUTRAL]: "Neutral",
  [MarketSentiment.BULLISH]: "Bullish",
  [MarketSentiment.EUPHORIC]: "Euphoric",
};

const VotingResultsTable: FC<VotingResultsTableProps> = ({
  votes,
  userVote,
}) => {
  // Ensure all vote values from -2 to 2 are present in the votes object
  const completeVotes = { ...defaultVoteValues, ...votes };

  // Check if any of the votes have non-zero values
  const hasVotes = Object.values(completeVotes).some(
    (voteCount) => voteCount > 0
  );

  // If no votes, return only the empty table without any highlights or messages
  if (!hasVotes) {
    return (
      <Box
        sx={{
          padding: "8px",
          marginTop: "24px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "8px",
          textAlign: "center",
          overflowX: "auto", // Enable horizontal scrolling if needed
        }}
      >
        <h3
          style={{ marginBottom: "12px", fontWeight: "bold", fontSize: "10px" }}
        >
          Voting Results
        </h3>
        <table
          className="table-auto border-collapse border border-gray-400"
          style={{ width: "100%", textAlign: "center", fontSize: "8px" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f3f3f3", fontSize: "8px" }}>
              {/* Render columns for each vote value in the desired order */}
              {voteValueOrder.map((label) => (
                <th key={label} className="border border-gray-300 px-4 py-2">
                  {sentimentLabels[label]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr style={{ fontSize: "10px" }}>
              {/* Render the counts for each vote value as zero */}
              {voteValueOrder.map((label) => (
                <td key={label} className="border border-gray-300 px-2 py-1">
                  0
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Box>
    );
  }

  // Convert Object.keys to numbers and cast them to MarketSentiment
  const winningSentiment = (Object.keys(completeVotes) as Array<string>)
    .map((key) => Number(key) as MarketSentiment) // Convert string keys to MarketSentiment enum values
    .reduce((a, b) => (completeVotes[a] > completeVotes[b] ? a : b));

  return (
    <Box
      sx={{
        padding: "8px",
        marginTop: "24px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "8px",
        textAlign: "center",
        overflowX: "auto", // Enable horizontal scrolling if needed
      }}
    >
      <h3
        style={{ marginBottom: "12px", fontWeight: "bold", fontSize: "10px" }} // Set a smaller font size for the heading
      >
        Voting Results
      </h3>
      <table
        className="table-auto border-collapse border border-gray-400"
        style={{ width: "100%", textAlign: "center", fontSize: "8px" }} // Set a smaller font size for the table
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3", fontSize: "8px" }}>
            {" "}
            {/* Slightly larger font for the headers */}
            {/* Render columns for each vote value in the desired order */}
            {voteValueOrder.map((label) => (
              <th key={label} className="border border-gray-300 px-4 py-2">
                {sentimentLabels[label]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr style={{ fontSize: "10px" }}>
            {" "}
            {/* Set the font size for the table body */}
            {/* Render the counts for each vote value in the desired order */}
            {voteValueOrder.map((label) => (
              <td
                key={label}
                className={`border border-gray-300 px-2 py-1  ${
                  userVote === label ? "bg-yellow-100" : "" // Highlight user's vote
                } ${
                  winningSentiment === label
                    ? "bg-green-100 font-bold text-green-800"
                    : ""
                }`}
              >
                {completeVotes[label] || 0}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Display user's vote and check if the user wins */}
      <Box mt={2} fontSize="12px">
        {userVote === null ? ( // Check if the user has not voted
          <div>Not Voted!</div>
        ) : (
          <div>
            {/* Display the user's vote */}
            Your Vote: <strong>{sentimentLabels[userVote]}</strong>
            {/* Check if the user has the winning vote */}
            {userVote === winningSentiment ? (
              <div style={{ color: "green", fontWeight: "bold" }}>
                🎉 Congratulations, you win!
              </div>
            ) : (
              <div style={{ color: "red" }}>You did not win this time.</div>
            )}
          </div>
        )}
      </Box>
    </Box>
  );
};

export default VotingResultsTable;

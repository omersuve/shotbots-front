import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

type VoteSummary = { [key: number]: number }; // Define the structure of the vote summary

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = await clientPromise;
    const db = client.db("votes");

    const { assetId } = req.query; // Get assetId from query parameters
    if (!assetId) {
      return res.status(400).json({ message: "Missing assetId" });
    }

    // Aggregate votes for the specified assetId
    const votesAggregation = await db
      .collection("asset-votes")
      .aggregate([
        { $match: { assetId: assetId } }, // Match by assetId
        {
          $group: {
            _id: "$vote", // Group by the `vote` value (-2, -1, ..., 2)
            count: { $sum: 1 }, // Count occurrences of each vote
          },
        },
      ])
      .toArray();

    // Format the aggregation result into a dictionary-like structure
    const voteSummary: VoteSummary = votesAggregation.reduce(
      (acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      },
      {} as VoteSummary
    );

    // Return the formatted vote summary
    res.status(200).json({ voteSummary });
  } catch (e) {
    console.error("Failed to fetch vote summary:", e);
    res.status(500).json({ message: "Failed to fetch vote summary" });
  }
};

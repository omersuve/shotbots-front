import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
    [collectionName: string]: number; // Define the type of data returned for each collection
}

interface ScoreDocument {
    _id: string;  // or ObjectId if you prefer
    timestamp: string;  // store as string initially
    score: number;
    key_url: string;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Check if the request method is POST
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed. Only POST requests are allowed." });
        }
        const client = await clientPromise;
        const db = client.db("coindesk-scores");
        const resultMap: ResponseData = {};

        // Get the request body
        const requestBody: string[] = req.body;

        const now = new Date();
        const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

        for (const collectionName of requestBody) {
            const scores = await db
              .collection<ScoreDocument>(collectionName)
              .find({})
              .toArray();

            // Filter and sum the scores in JavaScript
            const recentScores = scores
              .map(score => ({
                  ...score,
                  timestamp: new Date(score.timestamp),  // Convert timestamp string to Date object
              }))
              .filter(score => score.timestamp >= twoDaysAgo);  // Filter scores within the last 24 hours

            const totalScores = recentScores.reduce((acc, score) => acc + score.score, 0);  // Sum the scores
            const averageScore = recentScores.length ? totalScores / recentScores.length : 0;  // Calculate the average

            resultMap[collectionName] = Number(averageScore.toFixed(1)) * 10;
        }
        res.json(resultMap);
    } catch (e) {
        console.error(e);
    }
}
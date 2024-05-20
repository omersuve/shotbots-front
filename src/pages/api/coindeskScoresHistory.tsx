import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
    [collectionName: string]: { score: number, date: string }[]; // Define the type of data returned for each collection (array of averages)
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

        for (const collectionName of requestBody) {
            const scores = await db
                .collection<ScoreDocument>(collectionName)
                .find({})
                .toArray();

            // Initialize an array to hold the average scores for each of the last seven days
            const averages = [];

            for (let i = 0; i < 7; i++) {
                const startOfDay = new Date(now.getTime() - (i + 2) * 24 * 60 * 60 * 1000);
                const endOfDay = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);

                // Filter and sum the scores for the current day
                const dayScores = scores
                    .map(score => ({
                        ...score,
                        timestamp: new Date(score.timestamp),  // Convert timestamp string to Date object
                    }))
                    .filter(score => score.timestamp >= startOfDay && score.timestamp < endOfDay);

                const totalScores = dayScores.reduce((acc, score) => acc + score.score, 0);  // Sum the scores for the day
                const averageScore = dayScores.length ? totalScores / dayScores.length : 0;  // Calculate the average

                const formattedDate = `${String(endOfDay.getDate()).padStart(2, "0")}/${String(endOfDay.getMonth() + 1).padStart(2, "0")}/${String(endOfDay.getFullYear()).substring(2)}`;

                averages.push({ score: Number(averageScore.toFixed(1)) * 10, date: formattedDate });  // Store the average score, scaled by 10
            }

            // Store the array of averages in the result map
            resultMap[collectionName] = averages.reverse();
            console.log(collectionName, averages);
        }
        res.json(resultMap);
    } catch (e) {
        console.error(e);
    }
}
import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface ResponseData {
    [collectionName: string]: any[]; // Define the type of data returned for each collection
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Check if the request method is POST
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed. Only POST requests are allowed." });
        }
        // Get the request body
        const requestBody: string[] = req.body;
        const client = await clientPromise;
        const db = client.db("insight");
        const resultMap: ResponseData = {};

        // Loop through each collection name in the request body
        for (const collectionName of requestBody) {
            // Store the data in the map using the collection name as the key
            resultMap[collectionName] = await db
                .collection(collectionName)
                .find({})
                .limit(7)
                .toArray();
        }
        // Return the map as JSON
        res.json(resultMap);
    } catch (e) {
        console.error(e);
    }
}
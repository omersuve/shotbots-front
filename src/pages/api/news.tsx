import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
    [collectionName: string]: string[];
}

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
        const requestBody: RequestBody = req.body;
        // Ensure the request body is an array
        if (!Array.isArray(requestBody)) {
            return res.status(400).json({ error: "Invalid request body. Expected an array." });
        }
        const client = await clientPromise;
        const db = client.db("news");
        // Initialize a map to store the results
        const resultMap: ResponseData = {};

        // Loop through each collection name in the request body
        for (const collectionName of requestBody) {
            // Query the collection and fetch all documents
            const data = await db
                .collection(collectionName)
                .find({})
                .sort({ timestamp: -1 })
                .limit(5)
                .toArray();

            // Store the data in the map using the collection name as the key
            resultMap[collectionName] = data;
        }
        // Return the map as JSON
        res.json(resultMap);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
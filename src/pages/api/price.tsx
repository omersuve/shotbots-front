import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { tickers } = req.body;
    const response = await fetch("https://vercel-server-production.up.railway.app/api/price", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickers }),
    });

    const data = await response.json();
    res.status(200).json(data);
};
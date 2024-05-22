import { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";


export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Check if the request method is POST
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed. Only POST requests are allowed." });
        }

        // Get the request body
        const tickers: string[] = req.body;

        const responseObj: { [key: string]: { price: string; change: string } }  = {};

        for (const t of tickers) {
            const url = `https://www.coindesk.com/price/${t}`;
            const response = await fetch(url);
            const html = await response.text();

            const $ = load(html);

            const price = $(".currency-pricestyles__Price-sc-1v249sx-0").first().text().trim();
            const change = $(".price-valuestyles__PriceValueWrapper-sc-h5ehzl-0 h6").first().text().trim();

            responseObj[t] = { price, change };
        }

        res.json({ prices: responseObj });
    } catch (e) {
        console.error(e);
    }
}
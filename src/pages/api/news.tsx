import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";


interface ResponseData {
    [collectionName: string]: any[]; // Define the type of data returned for each collection
}

// Function to extract specific text and images while preserving order and removing unwanted elements
const cleanHtmlContent = (html: string): string | null => {
    const $ = load(html);

    // Define the selectors for elements to remove
    const removeSelectors = [
        ".unmute-button-container",
        ".SvgIcon__StyledSvgIcon-sc-2tb2y8-0",
        "figcaption",
        "img[alt=\"VolumeMute\"]",
        ".jwplaylist-custom-embedstyles__Wrapper-sc-czmf2o-2",
        ".social-sharestyles__StyledWrapper-sc-x6f9xi-1",
        ".social-urlstyles__StyledWrapper-sc-qwjbib-0",
        ".editor-custom-embedstyles__Wrapper-sc-9uzxe8-0",
        ".videos-playliststyles__PlayIcon-sc-1ox8ip1-2",
        ".jwplayer-video",
        ".headingstyles__StyledWrapper-sc-l955mv-0:has(h2.dYiraS:contains(\"Latest Prices\"))", // Latest Prices heading
        ".headingstyles__StyledWrapper-sc-l955mv-0:has(h2.dYiraS:contains(\"Top Stories\"))", // Top Stories heading
        ".headingstyles__StyledWrapper-sc-l955mv-0:has(h2.dYiraS:contains(\"Chart of the Day\"))", // Chart of the Day heading
        "#primis_player", // Primis player
        ".liststyles__StyledWrapper-sc-13iatdm-0", // Empty list sections
        ".common-textstyles__StyledWrapper-sc-18pd49k-0.eSbCkN:has(p i)", // Generic italic text within a paragraph, usually for author names
        ".common-textstyles__StyledWrapper-sc-18pd49k-0.eSbCkN:has(p:contains(\"This article originally appeared in\"))", // First Mover section
        ".headingstyles__StyledWrapper-sc-l955mv-0:has(h2.dYiraS:contains(\"Trending Posts\"))", // Trending Posts heading
    ];

    // Remove unwanted elements
    removeSelectors.forEach(selector => {
        $(selector).remove();
    });

    // Add <br> after every <p> tag and remove <p> tags that already have <br> tags
    $("p").each((index, element) => {
        const $element = $(element);
        if ($element.find("br").length > 0) {
            $element.remove();
        } else {
            $element.after("<br>");
        }
    });

    // Ensure images are full width
    $("img").each((index, element) => {
        const $element = $(element);
        $element.css({
            "width": "60%",
            "display": "block",
            "margin-left": "auto",
            "margin-right": "auto",
        });
        $element.after("<br>");
    });

    return $("body").html();
};

// Function to clean and modify title HTML content
const cleanTitleContent = (html: string): string | null => {
    const $ = load(html);

    // Find the at-headline and at-subheadline elements
    const headline = $(".at-headline").html();
    const subheadline = $(".at-subheadline").html();

    // Insert a new line between headline and subheadline if both exist
    if (headline && subheadline) {
        return `<div class="at-headline"><h1>${headline}</h1></div><br><div class="at-subheadline"><h2>${subheadline}</h2></div>`;
    }

    // Return the cleaned HTML as a string
    return $.html();
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Check if the request method is POST
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method not allowed. Only POST requests are allowed." });
        }

        // Get the request body
        const requestBody: string[] = req.body;
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
            resultMap[collectionName] = data.map((item: any) => {
                const cleanedHtml = cleanHtmlContent(item.body);
                const cleanedTitle = cleanTitleContent(item.title);
                return {
                    ...item,
                    title: cleanedTitle,
                    body: cleanedHtml,
                };
            });
        }
        // Return the map as JSON
        res.json(resultMap);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
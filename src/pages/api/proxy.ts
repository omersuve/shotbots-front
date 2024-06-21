import { createProxyMiddleware } from "http-proxy-middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed. Only GET requests are allowed." });
    }

    // Extract the target URL from the query parameter
    const targetUrl = decodeURIComponent(req.query.url as string);
    if (!targetUrl) {
        return res.status(400).json({ error: "Missing target URL" });
    }

    const proxy = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: {
            "^/api/proxy": "", // Remove base path
        },
    });

    (proxy as any)(req, res);
}

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to handle binary data correctly
    },
};

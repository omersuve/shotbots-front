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
        timeout: 5000, // Added timeout
        on: {
            error: (error, req, res, target) => {
                console.error(`Proxy error: ${error.message}`);
                (res as NextApiResponse).status(500).json({ error: "Proxy error", details: error.message });
            },
            proxyReq: (proxyReq, req, res) => {
                proxyReq.setHeader(":authority", "api-mainnet.magiceden.io");
                proxyReq.setHeader(":method", "GET");
                proxyReq.setHeader(":path", "/v2/unifiedSearch/xchain/collection/smb?edge_cache=true&limit=100");
                proxyReq.setHeader(":scheme", "https");
                proxyReq.setHeader("Accept", "application/json, text/plain, */*");
                proxyReq.setHeader("Accept-Encoding", "gzip, deflate, br, zstd");
                proxyReq.setHeader("Accept-Language", "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6");
                proxyReq.setHeader("If-None-Match", "W/\"2b40e-ypnnjredkYBH23Xb1u1rT1GXGIc\"");
                proxyReq.setHeader("Origin", "https://magiceden.io");
                proxyReq.setHeader("Priority", "u=1, i");
                proxyReq.setHeader("Referer", "https://magiceden.io/");
                proxyReq.setHeader("Sec-Ch-Ua", "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"");
                proxyReq.setHeader("Sec-Ch-Ua-Mobile", "?1");
                proxyReq.setHeader("Sec-Ch-Ua-Platform", "Android");
                proxyReq.setHeader("Sec-Fetch-Dest", "empty");
                proxyReq.setHeader("Sec-Fetch-Mode", "cors");
                proxyReq.setHeader("Sec-Fetch-Site", "same-site");
                proxyReq.setHeader("User-Agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36");
            },
            proxyRes: (proxyRes, req, res) => {
                // console.log(`Proxy response received from: ${targetUrl}`);
            },
        },
    });

    (proxy as any)(req, res);
}

export const config = {
    api: {
        bodyParser: false, // Disable body parsing to handle binary data correctly
        externalResolver: true,
    },
};

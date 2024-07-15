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
                // console.log(`Proxy request sent to: ${targetUrl}`);
                // proxyReq.setHeader("Connection", "keep-alive");
                // proxyReq.setHeader("User-Agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36");
                // proxyReq.setHeader("Accept-Language", "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6");
                // proxyReq.setHeader("Accept-Encoding", "gzip, deflate, br, zstd");
                // proxyReq.setHeader("Accept", "*/*");
                // proxyReq.setHeader("Sec-Fetch-Dest", "empty");
                // proxyReq.setHeader("Sec-Fetch-Mode", "cors");
                // proxyReq.setHeader("Sec-Fetch-Site", "same-origin");
                // proxyReq.setHeader("Origin", "https://magiceden.io");
                // proxyReq.setHeader("Referer", "https://magiceden.io/");
                // proxyReq.setHeader("sec-ch-ua", "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"");
                // proxyReq.setHeader("sec-ch-ua-mobile", "?1");
                // proxyReq.setHeader("sec-ch-ua-platform", "\"Android\"");
                proxyReq.setHeader("Connection", "keep-alive");
                proxyReq.setHeader("User-Agent", req.headers["user-agent"] || "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36");
                proxyReq.setHeader("Accept-Language", req.headers["accept-language"] || "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7,de;q=0.6");
                proxyReq.setHeader("Accept-Encoding", req.headers["accept-encoding"] || "gzip, deflate, br, zstd");
                proxyReq.setHeader("Accept", req.headers["accept"] || "*/*");
                proxyReq.setHeader("Sec-Fetch-Dest", req.headers["sec-fetch-dest"] || "empty");
                proxyReq.setHeader("Sec-Fetch-Mode", req.headers["sec-fetch-mode"] || "cors");
                proxyReq.setHeader("Sec-Fetch-Site", req.headers["sec-fetch-site"] || "same-origin");
                proxyReq.setHeader("Referer", req.headers["referer"] || "https://beta.shotbots.app/");
                proxyReq.setHeader("sec-ch-ua", req.headers["sec-ch-ua"] || "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"");
                proxyReq.setHeader("sec-ch-ua-mobile", req.headers["sec-ch-ua-mobile"] || "?1");
                proxyReq.setHeader("sec-ch-ua-platform", req.headers["sec-ch-ua-platform"] || "\"Android\"");
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

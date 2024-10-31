// import { createProxyMiddleware } from "http-proxy-middleware";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // if (req.method !== "GET") {
  //     return res.status(405).json({ error: "Method not allowed. Only GET requests are allowed." });
  // }
  // // Extract the target URL from the query parameter
  // const targetUrl = decodeURIComponent(req.query.url as string);
  // if (!targetUrl) {
  //     return res.status(400).json({ error: "Missing target URL" });
  // }
  // const proxy = createProxyMiddleware({
  //     target: targetUrl,
  //     changeOrigin: true,
  //     pathRewrite: {
  //         "^/api/proxy": "", // Remove base path
  //     },
  //     timeout: 5000, // Added timeout
  //     on: {
  //         error: (error, req, res, target) => {
  //             console.error(`Proxy error: ${error.message}`);
  //             (res as NextApiResponse).status(500).json({ error: "Proxy error", details: error.message });
  //         },
  //         proxyReq: (proxyReq, req, res) => {
  //             // console.log(`Proxy request sent to: ${targetUrl}`);
  //             proxyReq.setHeader("Connection", "keep-alive");
  //         },
  //         proxyRes: (proxyRes, req, res) => {
  //             // console.log(`Proxy response received from: ${targetUrl}`);
  //         },
  //     },
  // });
  // (proxy as any)(req, res);
}

// export const config = {
//   api: {
//     bodyParser: false, // Disable body parsing to handle binary data correctly
//     externalResolver: true,
//   },
// };

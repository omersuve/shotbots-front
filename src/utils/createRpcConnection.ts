import { Connection } from "@solana/web3.js";

export function createRpcConnection(): Connection {
  const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
  const QUICKNODE_API = process.env.QUICKNODE_API!;

  const heliusEndpoint = `https://rpc.helius.xyz?api-key=${HELIUS_API_KEY}`;
  const quicknodeEndpoint = `${QUICKNODE_API}`;

  // Randomly select an endpoint
  const rpcEndpoints = [heliusEndpoint, quicknodeEndpoint];
  const rpcEndpoint =
    rpcEndpoints[Math.floor(Math.random() * rpcEndpoints.length)];

  return new Connection(rpcEndpoint, { commitment: "confirmed" });
}

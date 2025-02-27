import { ObjectId } from "mongodb";

export type SendVoteBody = {
  vote: MarketSentiment;
  assetId: string;
  userId: string;
  timestamp: string;
  tag: string;
};

export type Tweet = {
  _id: ObjectId;
  tag: string;
  url: string;
  text: string;
  created_at: string;
  timestamp: string;
  day: string;
};

export type News = {
  _id: ObjectId;
  title: string;
  body: string;
  timestamp: string;
  tag: string;
  key_url: string;
  isVoteEnded: boolean;
  votes?: { [key: number]: number }; // Optional votes property to hold vote counts for each vote value
};

export type twitterResponse = {
  [collectionName: string]: any[];
};

export type VoteCount = {
  score: number;
  count: number;
};

export type DappRadarNft = {
  results: Result[];
  updatedAt: Date;
  currency: string;
  page: number;
  pageCount: number;
  resultCount: number;
  resultsPerPage: number;
};

export type Result = {
  name: string;
  slug: string;
  logo: string;
  link: string;
  activeChainIds: number[];
  chainIds: number[];
  floorPriceInFiat: null;
  floorPriceChange: null;
  avgPriceInFiat: number;
  avgPriceChange: number;
  marketCapInFiat: null;
  marketCapChange: null;
  volumeInFiat: number;
  volumeChange: number;
  tradersCount: number;
  tradersCountChange: number;
  salesCount: number;
  salesCountChange: number;
  new: boolean;
  isPartial: boolean;
  hasSubCollections: boolean;
  buyersCount: number;
  buyersCountChange: number;
  sellersCount: number;
  sellersCountChange: number;
  listedAt: Date;
};

export type NftData = {
  name: string;
  logoUrl: string;
  url: string;
  avgPrice: number;
  avgPriceChange: number;
  volumeUsd: number;
  volumeChange: number;
  traders: number;
  tradersChange: number;
  sales: number;
  salesChange: number;
  chainId: string;
  upVote?: number;
  downVote?: number;
};

export type MemecoinData = {
  baseAddress: string;
  logoUrl: string;
  name: string;
  symbol: string;
  price: number | null;
  price_change_1d: number | null;
  real_volume_1d: number | null;
  circulating_marketcap: number | null;
  chainId: string;
  url: string;
  liquidity: number | null;
  upVote?: number;
  downVote?: number;
};

export type MagicEdenNftData = {
  bitcoin: any[];
  solana: Data[];
  ethereum: any[];
  polygon: Data[];
  base: Data[];
};

export type Data = {
  name: string;
  symbol: string;
  contract: string;
  blockchain: Blockchain;
  image: string;
  isVerified: boolean;
  osVerified: boolean;
  externalIdentifier: null | string;
  enabledSearchablity: boolean;
  enabledTradeability: boolean;
  nickname: null | string;
  totalItems: number;
  totalVol: string;
  floorPrice: number | null;
  isCompressed: boolean;
  isLegacyCollection: boolean;
  chain?: string;
  feesInfo?: FeesInfo;
};

export enum Blockchain {
  BASE = "base",
  POLYGON = "polygon",
  SOLANA = "solana",
}

export type FeesInfo = {
  floorPrice: number;
  floorSellerBasisPoint: number;
  floorTokenStandard: number;
  floorTakerFeeBp: number;
  floorListedNftType: string;
};

export type PumpTokenData = {
  address: string; // Token mint address
  name: string; // Token name
  symbol: string; // Token symbol
  imageUri: string; // URI of the token image
  twitter: string; // Twitter handle or URL
  telegram: string; // Telegram handle or URL
  website: string; // Website URL
  marketCap: number; // Market capitalization in USD
  createdTimestamp: string; // Human-readable creation timestamp
  pumpUrl: string;
  dexUrl: string;
  blink_url: string;
};

export type TelegramMessage = {
  id: string;
  text: string;
  date: string;
  scores: (number | null)[];
  rugcheck?: {
    risks: string[];
    totalLPProviders: number;
    totalMarketLiquidity: number;
  };
  marketCap?: number; // New field for market capitalization
  createdAt?: string; // New field for creation time (ISO string format)
  volume1h?: number; // New field for 1-hour trading volume
  blink_url: string;
  holders?: number;
};

export enum MarketSentiment {
  DOOMED = -2,
  BEARISH = -1,
  NEUTRAL = 0,
  BULLISH = 1,
  EUPHORIC = 2,
}

// Default vote values for each sentiment type using enum keys
export const defaultVoteValues: { [key in MarketSentiment]: number } = {
  [MarketSentiment.DOOMED]: 0,
  [MarketSentiment.BEARISH]: 0,
  [MarketSentiment.NEUTRAL]: 0,
  [MarketSentiment.BULLISH]: 0,
  [MarketSentiment.EUPHORIC]: 0,
};

import { ObjectId } from "mongodb";

export type SendVoteBody = {
    vote: number;
    assetId: string;
    userId: string;
    timestamp: string;
    tag: string;
}

export type Tweet = {
    _id: ObjectId;
    tag: string;
    url: string;
    text: string;
    created_at: string;
    timestamp: string;
    day: string;
}

export type News = {
    _id: ObjectId;
    title: string;
    body: string;
    timestamp: string;
    tag: string;
    key_url: string;
    isVoteEnded: boolean;
}

export type twitterResponse = {
    [collectionName: string]: any[];
}

export type VoteCount = {
    score: number;
    count: number;
}

export type DappRadarNft = {
    results: Result[];
    updatedAt: Date;
    currency: string;
    page: number;
    pageCount: number;
    resultCount: number;
    resultsPerPage: number;
}

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
}

export type NftData = {
    name: string;
    logoUrl: string;
    url: string;
    floorPriceSol: number;
    totalSupply: number;
    uniqueHolders: number;
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
}

export type MagicEdenNftData = {
    bitcoin: any[];
    solana: Data[];
    ethereum: any[];
    polygon: Data[];
    base: Data[];
}

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
}

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
}

export type TelegramMessage = {
    group: string;
    sender: number;
    text: string;
    date: string;
}

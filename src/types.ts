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
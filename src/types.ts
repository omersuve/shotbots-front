import {ObjectId} from "mongodb";

export type sendVoteBody = {
    userId: string
    newsId: ObjectId
    vote: number
}

export type isAlreadyVotedRequest = {
    userId: string
    newsId: ObjectId
}

export type twitterResponse = {
    [collectionName: string]: any[];
}

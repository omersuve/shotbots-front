import { SendVoteBody, VoteCount } from "../types";

export function countVotes(voteArray: SendVoteBody[]): VoteCount[] {
    const voteCount: { [key: string]: number } = {
        "-3": 0,
        "-2": 0,
        "-1": 0,
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
    };

    voteArray.forEach(vote => {
        if (voteCount[vote.vote.toString()] !== undefined)
            voteCount[vote.vote.toString()]++;
        else voteCount[vote.vote.toString()] = 1;
    });

    return Object.keys(voteCount).map(score => ({
        score: parseInt(score, 10),
        count: voteCount[score],
    }));
}

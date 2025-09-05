import IVote from "./VoteModel";

interface IPoll {
    id: number;
    title: string;
    branch: string;
    year: string;
    options: string[];
    closesAt: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    voteCounts: Record<string, number>;
    votes: IVote[];
}

export default IPoll;
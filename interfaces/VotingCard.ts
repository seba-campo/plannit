import { Vote } from "./Vote";

export interface VotingCard {
    id: string
    title: string
    url: string
    averageValue: number;
    status: "voting" | "completed" | "skipped"
}

type CardStatus = "hidden" | "revealed";
type GameState = "voting" | "revealed";

interface IRealTimeRoom {
    averageScore: number | string;
    cardStatus: CardStatus;
    currentRound: number;
    gameState: GameState;
    isRevealed: boolean;
}

export default IRealTimeRoom
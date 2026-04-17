interface IRoomSession {
    roomId: string
    roomCode: string //Codigo de pocos digitos
    playerId: string
    playerName: string
    playerType: "player" | "admin"
}

export default IRoomSession;
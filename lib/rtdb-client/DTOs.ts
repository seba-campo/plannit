// Types for Firebase rtdb data structure
export interface FirebasePlayer {
  currentStatus: "spectator" | "player"
  name: string,
  uniqueId: string,
  userType: "admin" | "player"
  vote: number | null
  hasVoted: boolean
  lastSeen: number
  isOnline: boolean
  selection: number | null
}

export interface FirebaseRoom { 
  averageScore: number | string
  currentRound: number
  cardStatus: "hidden" | "revelaed"
  isRevealed: boolean
  createdAt: number
  gameState: "waiting" | "revealed"
  participants: Record<string, FirebasePlayer>
}

export interface RoomSession {
  roomId: string
  roomCode: string //Codigo de pocos digitos
  playerId: string
  playerName: string
  playerType: "player" | "admin"
  currentStatus: "player" | "spectator"
}
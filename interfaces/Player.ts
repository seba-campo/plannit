type UserType = "admin" | "player" | "spectator";

interface IPlayer {
  id: string
  name: string
  hasVoted: boolean
  isOnline: boolean
  userType: UserType
  uniqueId: string;
  vote: string | null
}

export default IPlayer;
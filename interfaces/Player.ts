type UserType = "admin" | "player";
type UserStatus = "player" | "spectator";

interface IPlayer {
  id: string
  name: string
  hasVoted: boolean
  isOnline: boolean
  userType: UserType
  currentStatus: UserStatus
  uniqueId: string;
  vote: string | null
}

export default IPlayer;
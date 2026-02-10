import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card"
import IPlayer from "@/interfaces/Player";
import IRoomSession from "@/interfaces/RoomSession";
import { Users, CheckCircle2, Eye, Coffee } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, if not I'll just use template literals carefully. Use template literals to be safe.

interface IPlayerListProps {
  getActivePlayersCount: () => number;
  getSpectatorsCount: () => number;
  revealed: boolean;
  average: string;
  players: IPlayer[];
  roomSession: IRoomSession;
}

const PlayerList = ({
  getActivePlayersCount,
  getSpectatorsCount,
  revealed,
  average,
  players,
  roomSession,
}: IPlayerListProps) => {

  const getCardStyles = (player: IPlayer) => {
    const isMe = player.uniqueId === roomSession?.playerId;
    const isSpectator = player.currentStatus === "spectator";
    const hasVoted = player.hasVoted;
    const isOffline = !player.isOnline;

    let base = "p-4 rounded-xl border transition-all duration-500 relative overflow-hidden flex flex-col justify-between gap-3 ";

    if (isOffline) return base + "opacity-50 border-dashed border-gray-200 bg-gray-30/50";

    if (isSpectator) return base + "border-dashed border-muted-foreground/20 bg-muted/20 text-muted-foreground";

    if (hasVoted && !revealed) {
      return base + "border-green-500/50 bg-green-500/10 shadow-[0_0_15px_-4px_rgba(34,197,94,0.3)] scale-[1.02] ring-1 ring-green-500/20";
    }

    if (isMe) {
      return base + "border-primary/40 bg-primary/5 ring-1 ring-primary/20";
    }

    return base + "border-accent bg-card/50 hover:border-primary/20";
  }

  return (
    <Card className="bg-accent/50 border-accent">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Team Members
          </h2>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <span className="font-medium text-foreground">{getActivePlayersCount()}</span> Playing
            </div>
            {getSpectatorsCount() > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="font-medium text-foreground">{getSpectatorsCount()}</span> Watching
              </div>
            )}
          </div>

          {revealed && (
            <div className="ml-4 border-l pl-4">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Average</div>
              <div className="text-2xl font-bold text-primary">{average}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((player) => {
            const isSpectator = player.currentStatus === "spectator";

            return (
              <div
                key={player.id}
                className={getCardStyles(player)}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium truncate pr-2" title={player.name}>{player.name}</div>
                  <div className="flex flex-col gap-1 items-end">
                    {player.userType === "admin" && (
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 flex items-center gap-1 bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20">
                        ADMIN
                      </Badge>
                    )}
                    {roomSession?.playerId === player.uniqueId && (
                      <Badge variant="outline" className="text-[10px] h-5 px-1.5">YOU</Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-center items-center min-h-[40px]">
                  {/* Status Indicator */}
                  {isSpectator ? (
                    <div className="flex items-center gap-2 text-muted-foreground/20">
                      <Eye className="h-5 w-5" />
                      <span className="text-sm font-medium">Watching</span>
                    </div>
                  ) : revealed ? (
                    <div className="text-3xl font-bold text-primary animate-in zoom-in duration-300">
                      {player.vote || "-"}
                    </div>
                  ) : player.hasVoted ? (
                    <div className="flex items-center gap-2 text-green-600 animate-in zoom-in spin-in-12 duration-500">
                      <CheckCircle2 className="h-8 w-8" />
                      <span className="text-sm font-bold">Voted!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground/30">
                      <Coffee className="h-6 w-6" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default PlayerList

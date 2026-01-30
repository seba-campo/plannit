import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card"
import IPlayer from "@/interfaces/Player";
import IRoomSession from "@/interfaces/RoomSession";
import { Users } from "lucide-react";

interface IPlayerListProps {
    getActivePlayersCount:  () => number;
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

  return ( 
    <Card className="bg-accent/50 border-accent">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Team Results ({getActivePlayersCount()} players
            {getSpectatorsCount() > 0 && `, ${getSpectatorsCount()} spectators`})
          </h2>

          {revealed && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Average</div>
              <div className="text-2xl font-bold text-primary">{average}</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {players.map((player) => (
            <div
              key={player.id}
              className={`
                p-4 rounded-lg border 
                ${player.id === roomSession?.playerId
                  ? "border-primary bg-primary/10"
                  : "border-accent bg-background"
                } 
                ${!player.isOnline ? "opacity-50" : ""}`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{player.name}</div>
                <div className="flex gap-1">
                  {player.userType === "admin" && (
                    <Badge variant="default" className="text-xs">
                      Creator
                    </Badge>
                  )}
                  {player.userType === "spectator" && (
                    <Badge variant="outline" className="text-xs">
                      
                    </Badge>
                  )}
                  {!player.isOnline && (
                    <Badge variant="outline" className="text-xs">
                      Offline
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                {
                  player.userType === "spectator" ? 
                    (<div className="text-sm text-muted-foreground">Watching</div>) :
                  revealed ? 
                    (<div className="text-2xl font-bold text-primary">{player.vote || "-"}</div>) : 
                    (<div
                        className={`
                          w-8 h-8 rounded-full 
                          ${player.hasVoted ? "bg-blue-500" : "bg-gray-700"}
                        `}
                      >
                      </div>
                    )
                }
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PlayerList
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomSession } from "@/lib/rtdb-client/rtdb";
import { LogOut, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";

interface IHeaderInformation {
    roomId: string;
    currentRound: number;
    isConnected: boolean;
    currentUserType: "admin" | "player" | "spectator";
    isCreator: () => boolean;
    isSpectator: () => boolean;
    handleLogOut: () => void;
    roomSession?: RoomSession;
}

const HeaderInformation = ({
    roomId,
    currentRound,
    isConnected,
    currentUserType,
    isCreator,
    isSpectator,
    handleLogOut,
    roomSession
}: IHeaderInformation) => {
    return (
        <div className="container mx-auto px-4">
            {/* Primera fila: Logo y Exit Button */}
            <div className="flex items-center justify-between mb-3 sm:mb-0">
                <Link href="/" className="text-2xl font-bold text-primary">
                    PlannIt
                </Link>

                <Button
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 bg-transparent"
                    onClick={handleLogOut}
                >
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Exit Room</span>
                </Button>
            </div>

            {/* Segunda fila: Información del room y usuario */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
                {/* Room Info */}
                <div className="text-center sm:text-left order-1">
                    <div className="text-sm text-blue-400">Room: {roomId}</div>
                    <div className="text-xs text-muted-foreground">Round {currentRound}</div>
                </div>

                {/* Connection Status */}
                <div className="flex items-center justify-center gap-2 order-3 sm:order-2">
                    {isConnected ? <Wifi className="h-4 w-4 text-green-400" /> : <WifiOff className="h-4 w-4 text-red-400" />}
                    <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
                </div>

                {/* User Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 order-2 sm:order-3">
                    <span className="text-sm text-muted-foreground text-center sm:text-right">
                        Playing as: {roomSession?.playerName}
                    </span>
                    <Badge className="self-center sm:self-auto" variant={isSpectator() ? "outline" : isCreator() ? "default" : "secondary"}>
                        {currentUserType === "admin" ? "Creator" : currentUserType === "spectator" ? "Spectator" : "Player"}
                    </Badge>
                </div>
            </div>
        </div>
    )
}

export default HeaderInformation
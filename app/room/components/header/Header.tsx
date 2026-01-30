import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomSession } from "@/lib/firebase";
import { LogOut, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";

interface IHeaderInformation{
    roomId: string;
    currentRound: number;
    isConnected: boolean;
    currentUserType: "admin" | "player" | "spectator";
    isCreator: () => boolean;
    isSpectator: () => boolean;
    handleLogOut: () => void;
    roomSession?: RoomSession;
}

const  HeaderInformation= ({
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
        <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
                PlannIt
            </Link>

            <div className="text-center">
            <div className="text-sm text-blue-400">Room: {roomId}</div>
            {/* {roomData?.roomName && <div className="text-xs text-muted-foreground">{roomData.roomName}</div>} */}
            <div className="text-xs text-muted-foreground">Round {currentRound}</div>
            </div>

            <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                {isConnected ? <Wifi className="h-4 w-4 text-green-400" /> : <WifiOff className="h-4 w-4 text-red-400" />}
                <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>

            <div className="text-sm text-muted-foreground">
                Playing as: {roomSession?.playerName}
                <Badge className="ml-2" variant={isSpectator() ? "outline" : isCreator() ? "default" : "secondary"}>
                {currentUserType === "admin" ? "Creator" : currentUserType === "spectator" ? "Spectator" : "Player"}
                </Badge>
            </div>
            <Button
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 bg-transparent"
                onClick={handleLogOut}
            >
                <LogOut className="mr-2 h-4 w-4" />
                Exit Room
            </Button>
            </div>
        </div>
    )
}

export default HeaderInformation
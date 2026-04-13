import EstimationCard from "@/components/estimationCard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, EyeOff, RotateCcw, UserX } from "lucide-react";
import { useRoomActions } from "../../[roomId]/hooks/useRoomActions";
import { type RoomSession } from "@/lib/rtdb-client/DTOs";

interface IGameBoard {
    roomSession: RoomSession | undefined;
    revealed: boolean;
    userRole: "admin" | "player";
    userStatus: "player" | "spectator";
    average: string;
    currentPlayerVote: string | null;
    atLeastOnePlayerVoted: boolean;
    setUserStatus: (status: "player" | "spectator") => void;
    scaleValues: any[];
}

const GameBoard = ({
    roomSession,
    revealed,
    userRole,
    userStatus,
    average,
    currentPlayerVote,
    atLeastOnePlayerVoted,
    scaleValues,
    setUserStatus,
}: IGameBoard) => {
    const {
        handleCardSelect,
        handleReveal,
        handleReset,
        handleUserTypeToggle
    } = useRoomActions(roomSession, userStatus);

    const isCreator = () => userRole === "admin";
    const isSpectator = () => userStatus === "spectator";

    const isRevealDisabled = !revealed && !atLeastOnePlayerVoted;
    const isResetDisabled = !revealed;

    const onUserTypeToggle = () => {
        handleUserTypeToggle(setUserStatus);
    }

    return (
        <Card className="mb-8 bg-accent/50 border-accent" style={{ position: "relative", overflow: "hidden" }}>
            <CardContent className="p-6" style={{ position: "relative", zIndex: 1 }}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">Estimation Cards</h2>
                        {isSpectator() ? (
                            <p className="text-sm text-muted-foreground">You're watching as a spectator</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {currentPlayerVote ? `Your vote: ${currentPlayerVote}` : "Select your estimate"}
                            </p>
                        )}
                    </div>

                    {isCreator() && (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={onUserTypeToggle}
                            >
                                <UserX className="mr-2 h-4 w-4" />
                                {isSpectator() ? "Join as Player" : "Watch as Spectator"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleReveal(true, revealed, average)}
                                disabled={isRevealDisabled}
                                className="flex-1 sm:flex-none"
                            >
                                {revealed ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                                <span className="hidden sm:inline">{revealed ? "Revealed" : "Reveal Cards"}</span>
                                <span className="sm:hidden">{revealed ? "Revealed" : "Reveal"}</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleReset(true)}
                                disabled={isResetDisabled}
                                className="flex-1 sm:flex-none"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Next Round</span>
                                <span className="sm:hidden">Reset</span>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))" }}>
                    {scaleValues.map((value) => (
                        <EstimationCard
                            key={value}
                            value={value}
                            onClick={() => handleCardSelect(value, revealed)}
                            disabled={revealed || isSpectator()}
                            isSelected={String(currentPlayerVote) === String(value)}
                        />
                    ))}
                </div>
                {isSpectator() && (
                    <Alert className="mt-4 border-blue-500 bg-blue-500/10">
                        <AlertDescription className="text-blue-400">
                            You're in spectator mode. You can watch the voting but cannot participate.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

export default GameBoard;
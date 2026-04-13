import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UserCheck, UserX } from "lucide-react";

interface IToggleUserType {
    isSpectator: () => boolean;
    handleUserTypeToggle: () => void;
    isUpdatingUserType: boolean;
    isCreator: () => boolean;
    isRevealed: boolean;
}

const ToggleUserType = ({
    isSpectator,
    handleUserTypeToggle,
    isUpdatingUserType,
    isCreator,
    isRevealed
}: IToggleUserType) => {
    return (
        <Card className="mb-4 bg-neon/5 border-neon/15 backdrop-blur-md">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="font-medium">Participation Mode</h3>
                        <p className="text-sm text-muted-foreground">
                            {isSpectator()
                                ? "You're watching as a spectator. Switch to player mode to participate in voting."
                                : "You're participating as a player. Switch to spectator mode to watch without voting."}
                        </p>
                    </div>
                    <Button
                        onClick={handleUserTypeToggle}
                        disabled={isUpdatingUserType || isRevealed}
                        variant={isSpectator() ? "default" : "outline"}
                        className="w-full sm:w-auto"
                    >
                        {isUpdatingUserType ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : isSpectator() ? (
                            <UserCheck className="mr-2 h-4 w-4" />
                        ) : (
                            <UserX className="mr-2 h-4 w-4" />
                        )}
                        {isSpectator() || isCreator() ? "Join as Player" : "Watch as Spectator"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default ToggleUserType;
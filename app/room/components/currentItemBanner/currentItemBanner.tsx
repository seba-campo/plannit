"use client"

import { Card, CardContent } from "@/components/ui/card"
import useCurrentItemBanner from "./useCurrentItemBanner"
import HistoryCard from "./components/HistoryCard"
import { Clock } from "lucide-react"

interface CurrentItemBannerProps {
    roomId: string
}

export default function CurrentItemBanner({
    roomId,

}: CurrentItemBannerProps) {
    const {
        currentCard,
        history,
        averageScore,
    } = useCurrentItemBanner(roomId)

    const hookAverageScore = averageScore ?? undefined;

    return (
        <Card className="border-accent transition-all bg-accent/50 backdrop-blur-md rounded-lg border text-card-foreground shadow-sm bg">
            <div className="space-y-1 pb-3 pl-6 pt-2 mt-4 block">
                <h2 className="text-xl font-semibold flex items-center">
                    Currently voting
                </h2>
            </div>

            <CardContent className="space-y-4">
                {/* Current Voting Card */}
                {currentCard ? (
                    <HistoryCard card={currentCard} isHistory={false} votingValue={hookAverageScore} />
                ) : (
                    <div className="p-8 text-center rounded-lg border-2 border-dashed border-muted">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">
                            Actually voting... well, nothing :/
                        </p>
                    </div>
                )}

                {/* History Section */}
                {history && history.filter(h => h.id).length > 0 && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                History
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {history.filter(h => h.id).map((card) => (
                                <HistoryCard key={card.id} card={card} isHistory={true} votingValue={card.averageValue} />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

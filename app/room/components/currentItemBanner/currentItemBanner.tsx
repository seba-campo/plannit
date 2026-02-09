"use client"

import { Card, CardContent } from "@/components/ui/card"
import { VotingCard } from "@/interfaces/VotingCard"
import useCurrentItemBanner from "./useCurrentItemBanner"
import HistoryCard from "./components/HistoryCard"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface CurrentItemBannerProps {
    roomId: string
    currentCard?: VotingCard
    history?: VotingCard[]
}

export default function CurrentItemBanner({
    roomId,
    currentCard: propCurrentCard,
    history: propHistory = []

}: CurrentItemBannerProps) {
    const { 
        currentCard: hookCurrentCard, 
        history: hookHistory, 
    } = useCurrentItemBanner(roomId)

    const currentCard = propCurrentCard || hookCurrentCard
    const history = propHistory.length > 0 ? propHistory : hookHistory

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
                    <HistoryCard card={currentCard} isHistory={false} />
                ) : (
                    <div className="p-8 text-center rounded-lg border-2 border-dashed border-muted">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">
                            Nothing here... yet
                        </p>
                    </div>
                )}

                {/* History Section */}
                {history && history.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                History
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {history.map((card) => (
                                <HistoryCard key={card.id} card={card} isHistory={true} />
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

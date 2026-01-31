"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, CheckCircle2, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { VotingCard } from "@/interfaces/VotingCard"

interface CurrentItemBannerProps {
    currentCard?: VotingCard
    history?: VotingCard[]
}

export default function CurrentItemBanner({
    currentCard,
    history = []
}: CurrentItemBannerProps) {

    const getStatusIcon = (status: VotingCard["status"]) => {
        switch (status) {
            case "completed":
                return <CheckCircle2 className="h-4 w-4" />
            case "voting":
                return <Clock className="h-4 w-4" />
            case "skipped":
                return <XCircle className="h-4 w-4" />
        }
    }

    const getStatusColor = (status: VotingCard["status"]) => {
        switch (status) {
            case "completed":
                return "bg-green-500/20 text-green-400 border-green-500/30"
            case "voting":
                return "bg-blue-500/20 text-blue-400 border-blue-500/30"
            case "skipped":
                return "bg-gray-500/20 text-gray-400 border-gray-500/30"
        }
    }

    const HistoryCard = (card: VotingCard, isHistory: boolean = false) => (
        <div
            key={card.id}
            className={cn(
                "relative p-4 rounded-lg border-2 transition-all duration-500",
                isHistory
                    ? "bg-muted/30 border-muted opacity-60 hover:opacity-80"
                    : "bg-accent/60 backdrop-blur-md border-accent tech-card-glow"
            )}
        >
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-3">
                <Badge
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 border",
                        getStatusColor(card.status)
                    )}
                >
                    {getStatusIcon(card.status)}
                    <span className="text-xs font-medium capitalize">
                        {card.status === "voting" ? "En votación" : card.status === "completed" ? "Completado" : "Omitido"}
                    </span>
                </Badge>

                {/* Voting Value */}
                {card.votingValue !== null && (
                    <div className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm",
                        isHistory
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/20 text-primary border border-primary/30"
                    )}>
                        {card.votingValue}
                    </div>
                )}
            </div>

            {/* Title and Link */}
            <div className="space-y-2">
                <h3 className={cn(
                    "font-semibold text-base leading-tight",
                    isHistory ? "text-muted-foreground" : "text-foreground"
                )}>
                    {card.title}
                </h3>

                <a
                    href={card.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "inline-flex items-center gap-1.5 text-sm transition-colors group",
                        isHistory
                            ? "text-muted-foreground/70 hover:text-muted-foreground"
                            : "text-primary/80 hover:text-primary"
                    )}
                >
                    <span className="truncate max-w-[200px]">{card.link}</span>
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
            </div>
        </div>
    )

    return (
        <Card className="border-2 transition-all duration-500 bg-accent/60 backdrop-blur-md">
            <div className="space-y-1 pb-3 pl-6 pt-2 mt-4 block">
                <h2 className="text-xl font-semibold flex items-center">
                    Votación Actual
                </h2>
            </div>

            <CardContent className="space-y-4">
                {/* Current Voting Card */}
                {currentCard ? (
                    HistoryCard(currentCard, false)
                ) : (
                    <div className="p-8 text-center rounded-lg border-2 border-dashed border-muted">
                        <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">
                            No hay ninguna card en votación actualmente
                        </p>
                    </div>
                )}

                {/* History Section */}
                {history.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Historial
                            </span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                            {history.map((card) => HistoryCard(card, true))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

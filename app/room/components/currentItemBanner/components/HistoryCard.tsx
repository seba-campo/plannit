import { VotingCard } from "@/interfaces/VotingCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import useCurrentItemBanner from "../useCurrentItemBanner";

interface HistoryCardProps {
    card: VotingCard
    isHistory?: boolean
}

const HistoryCard = ({ card, isHistory = false }: HistoryCardProps) => {
    const { getStatusIcon, getStatusColor } = useCurrentItemBanner()

    return (
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
                        {card.status === "voting" ? "Voting" : card.status === "completed" ? "Completed" : "Skipped"}
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
                        {card.averageValue}
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
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                        "inline-flex items-center gap-1.5 text-sm transition-colors group",
                        isHistory
                            ? "text-muted-foreground/70 hover:text-muted-foreground"
                            : "text-primary/80 hover:text-primary"
                    )}
                >
                    <span className="truncate max-w-[200px]">{card.url}</span>
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
            </div>
        </div>
    )
}

export default HistoryCard

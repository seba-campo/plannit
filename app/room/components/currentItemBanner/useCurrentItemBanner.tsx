import { useEffect, useState } from "react"
import { VotingCard } from "@/interfaces/VotingCard"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { FirebaseRoomService } from "@/lib/rtdb-client/rtdb"

export const getStatusIcon = (status: VotingCard["status"]) => {
    switch (status) {
        case "completed":
            return <CheckCircle2 className="h-4 w-4" />
        case "voting":
            return <Clock className="h-4 w-4" />
        case "skipped":
            return <XCircle className="h-4 w-4" />
    }
}

export const getStatusColor = (status: VotingCard["status"]) => {
    switch (status) {
        case "completed":
            return "bg-green-500/20 text-green-400 border-green-500/30"
        case "voting":
            return "bg-blue-500/20 text-blue-400 border-blue-500/30"
        case "skipped":
            return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
}

const useCurrentItemBanner = (roomId?: string) => {
    const [currentCard, setCurrentCard] = useState<VotingCard | null>(null)
    const [history, setHistory] = useState<VotingCard[] | null>(null)
    const [averageScore, setAverageScore] = useState<number | null>(null)

    useEffect(() => {
        if (!roomId) return;

        const rtdb = new FirebaseRoomService();

        const unsubscribeTickets = rtdb.subscribeToTickets(roomId, (tickets) => {
            if (Array.isArray(tickets) && tickets.length > 0) {
                setCurrentCard(tickets[0])
            } else {
                setCurrentCard(null)
            }
        });

        const unsubscribeHistory = rtdb.subscribeToTicketHistory(roomId, (historyData) => {
            let history = historyData;
            if (history && !Array.isArray(history)) {
                history = [history];
            }
            setHistory(Array.isArray(history) ? history : null)
        });

        const unsubscribeAverageScore = rtdb.subscribeToAverageScore(roomId, (averageScoreData) => {
            setAverageScore(averageScoreData)
        });

        return () => {
            unsubscribeTickets();
            unsubscribeHistory();
            unsubscribeAverageScore();
            rtdb.cleanup();
        };
    }, [roomId]);

    return {
        currentCard,
        history,
        averageScore,
        getStatusIcon,
        getStatusColor
    }
}

export default useCurrentItemBanner
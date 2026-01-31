/**
 * Example usage of CurrentItemBanner component
 * 
 * This file demonstrates how to integrate the CurrentItemBanner component
 * with your voting system.
 */

import CurrentItemBanner from "./currentItemBanner"

// Example data structure
const exampleCurrentCard = {
    id: "card-1",
    title: "Implementar autenticación con OAuth2",
    link: "https://linear.app/issue/PLAN-123",
    votingValue: null, // null while voting is in progress
    status: "voting" as const
}

const exampleHistory = [
    {
        id: "card-2",
        title: "Refactorizar componente de header",
        link: "https://linear.app/issue/PLAN-122",
        votingValue: 5,
        status: "completed" as const
    },
    {
        id: "card-3",
        title: "Agregar tests unitarios para PlayerList",
        link: "https://linear.app/issue/PLAN-121",
        votingValue: 3,
        status: "completed" as const
    },
    {
        id: "card-4",
        title: "Diseño de nueva landing page",
        link: "https://linear.app/issue/PLAN-120",
        votingValue: null,
        status: "skipped" as const
    }
]

// Example component usage
export default function ExampleUsage() {
    return (
        <div className="p-8">
            <CurrentItemBanner
                currentCard={exampleCurrentCard}
                history={exampleHistory}
            />
        </div>
    )
}

/**
 * Integration Guide:
 * 
 * 1. Import the component in your room page:
 *    import CurrentItemBanner from "@/app/room/components/currentItemBanner/currentItemBanner"
 * 
 * 2. Manage the state for current card and history:
 *    const [currentCard, setCurrentCard] = useState<VotingCard | undefined>()
 *    const [history, setHistory] = useState<VotingCard[]>([])
 * 
 * 3. When a vote is completed, move the card to history:
 *    const completeVoting = (finalValue: number) => {
 *      if (currentCard) {
 *        setHistory(prev => [{
 *          ...currentCard,
 *          votingValue: finalValue,
 *          status: "completed"
 *        }, ...prev])
 *        setCurrentCard(undefined) // or load next card
 *      }
 *    }
 * 
 * 4. Use in your JSX:
 *    <CurrentItemBanner 
 *      currentCard={currentCard}
 *      history={history}
 *    />
 */

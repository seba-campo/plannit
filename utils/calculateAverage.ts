import { Player } from "@/components/playerList"

export const calculateAverage = (players: Player[]) => {
    const numericVotes = players
        .filter((p) => p.vote && p.vote !== "?" && p.vote !== '0' && p.isOnline && p.userType !== "spectator")
        .map((p) => Number.parseInt(p.vote as string))
        .filter((vote) => !isNaN(vote))

    if (numericVotes.length === 0) return "-"
    const sum = numericVotes.reduce((acc, val) => acc + val, 0)
    return (sum / numericVotes.length).toFixed(1)
}
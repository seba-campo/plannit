import { Player } from "@/components/playerList"

const isNumericVoting = (scaleValues: string[]): boolean =>
    scaleValues.every((v) => !isNaN(Number(v)) || v === "?")

const calcNumericAverage = (players: Player[]): string => {
    const numericVotes = players
        .filter((p) => p.vote && p.vote !== "?" && p.vote !== "0" && p.isOnline && p.userType !== "spectator")
        .map((p) => Number.parseInt(p.vote as string))
        .filter((vote) => !isNaN(vote))

    if (numericVotes.length === 0) return "-"
    const sum = numericVotes.reduce((acc, val) => acc + val, 0)
    return (sum / numericVotes.length).toFixed(1)
}

const calcTshirtMode = (players: Player[], scaleValues: string[]): string => {
    const validVotes = players
        .filter((p) => p.vote && p.vote !== "?" && p.vote !== "0" && p.isOnline && p.userType !== "spectator")
        .map((p) => p.vote as string)
        .filter((v) => scaleValues.includes(v))

    if (validVotes.length === 0) return "-"

    const counts = new Map<string, number>()
    for (const vote of validVotes) {
        counts.set(vote, (counts.get(vote) ?? 0) + 1)
    }

    const maxCount = Math.max(...counts.values())
    const tied = [...counts.entries()]
        .filter(([, count]) => count === maxCount)
        .map(([value]) => value)

    // On tie, pick the element with the highest index in scaleValues (i.e. the "largest")
    return tied.reduce((highest, current) =>
        scaleValues.indexOf(current) > scaleValues.indexOf(highest) ? current : highest
    )
}

export const calculateAverage = (players: Player[], scaleValues: string[] = []): string => {
    if (scaleValues.length > 0 && !isNumericVoting(scaleValues)) {
        return calcTshirtMode(players, scaleValues)
    }
    return calcNumericAverage(players)
}

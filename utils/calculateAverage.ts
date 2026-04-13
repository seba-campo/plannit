import { Player } from "@/components/playerList"

const SPECIAL_SCALE_VALUES = ["?", "☕"]

const isNumericVoting = (scaleValues: (string | number)[]): boolean =>
    scaleValues
        .filter((v) => !SPECIAL_SCALE_VALUES.includes(String(v)))
        .every((v) => !isNaN(Number(v)))

const calcNumericAverage = (players: Player[]): string => {
    const numericVotes = players
        .filter((p) => p.hasVoted && p.vote && p.vote !== "?" && p.vote !== "0")
        .map((p) => Number(p.vote))
        .filter((vote) => !isNaN(vote))

    if (numericVotes.length === 0) return "-"
    const sum = numericVotes.reduce((acc, val) => acc + val, 0)
    return (sum / numericVotes.length).toFixed(1)
}

const calcTshirtMode = (players: Player[], scaleValues: (string | number)[]): string => {
    const stringScaleValues = scaleValues.map(String)
    const validVotes = players
        .filter((p) => p.hasVoted && p.vote && p.vote !== "?" && p.vote !== "0")
        .map((p) => p.vote as string)
        .filter((v) => stringScaleValues.includes(v))

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
        stringScaleValues.indexOf(current) > stringScaleValues.indexOf(highest) ? current : highest
    )
}

export const calculateAverage = (players: Player[], scaleValues: (string | number)[] = []): string => {
    if (scaleValues.length > 0 && !isNumericVoting(scaleValues)) {
        return calcTshirtMode(players, scaleValues)
    }
    return calcNumericAverage(players)
}

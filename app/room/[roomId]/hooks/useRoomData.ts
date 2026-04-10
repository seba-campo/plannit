import { useState, useEffect, useCallback, useRef } from "react"
import { firebaseRoomService } from "@/lib/rtdb-client/rtdb"
import { FirebaseRoom } from "@/lib/rtdb-client/DTOs"
import Player from "@/interfaces/Player"
import { calculateAverage } from "@/utils/calculateAverage"

export const useRoomData = (roomId: string, isSessionReady: boolean, roomCode?: string) => {
    const [players, setPlayers] = useState<Player[]>([])
    const [roomData, setRoomData] = useState<FirebaseRoom | null>(null)
    const [dataError, setDataError] = useState<string | null>(null)
    const [scaleValues, setScaleValues] = useState<string[]>([])

    const [revealed, setRevealed] = useState(false)
    const [gameState, setGameState] = useState<"waiting" | "voting" | "revealed">("waiting")
    const [currentRound, setCurrentRound] = useState(1)

    const [isLoading, setIsLoading] = useState(true)
    const [isConnected, setIsConnected] = useState(false)

    const atLeastOnePlayerVoted = players.some((player) => player.hasVoted)

    const unsubscribeRef = useRef<(() => void)[]>([])

    const setupRealtimeListeners = useCallback((id: string) => {
        // Listen for room updates
        const roomUnsubscribe = firebaseRoomService.subscribeToRoom(id, (room) => {
            if (room) {
                setRoomData(room)
                setRevealed(room.isRevealed || false)
                setGameState(room.gameState || "waiting")
                setCurrentRound(room.currentRound || 1)
                setIsLoading(false)
                setIsConnected(true)
            }
        })

        // Listen for players updates
        const playersUnsubscribe = firebaseRoomService.subscribeToPlayers(id, (playersData) => {
            const data = playersData
            const playersList: any = Object.entries(data).map(([id, player]) => {
                if (!player) return null

                return {
                    id,
                    vote: player.vote !== null && player.currentStatus !== 'spectator' ? String(player.vote) : "0",
                    hasVoted: player.hasVoted || false,
                    isOnline: player.isOnline || false,
                    lastSeen: player.lastSeen || null,
                    name: player.name,
                    uniqueId: player.uniqueId,
                    userType: player.userType || "player",
                    currentStatus: player.currentStatus || "player"
                }
            }).filter(Boolean)
            setPlayers(playersList)
        })

        unsubscribeRef.current = [roomUnsubscribe, playersUnsubscribe]
    }, [])

    const average = calculateAverage(players)
    const allVoted = players.filter((p) => p.isOnline && p.currentStatus !== "spectator").every((player) => player.hasVoted)

    const getActivePlayersCount = () => {
        return players.filter((p) => p.isOnline && p.currentStatus !== "spectator").length
    }

    const getSpectatorsCount = () => {
        return players.filter((p) => p.isOnline && p.currentStatus === "spectator").length
    }

    const getRoomLongId = () => {
        const localRoomData = localStorage.getItem(`currentRoom`)
        if (localRoomData) {
            return JSON.parse(localRoomData).roomId;
        }
        return null
    }

    useEffect(() => {
        let mounted = true;
        const initData = async () => {
            if (isSessionReady && roomId) {
                try {
                    const [initialRoom] = await Promise.all([
                        firebaseRoomService.initializeRoom(roomId),
                        roomCode
                            ? apiClient.getRoomDetails(roomCode).then((res) => {
                                if (mounted) setScaleValues(res.data.votingType.scaleValues)
                            }).catch(() => {})
                            : Promise.resolve()
                    ])

                    if (!mounted) return;

                    if (!initialRoom) {
                        setDataError("Room not found or has been deleted")
                        setIsLoading(false)
                        return
                    }

                    setRoomData(initialRoom)
                    setRevealed(initialRoom.isRevealed || false)
                    setGameState(initialRoom.gameState || "waiting")
                    setCurrentRound(initialRoom.currentRound || 1)
                    setIsConnected(true)

                    setupRealtimeListeners(roomId)
                } catch (err) {
                    if (mounted) {
                        setDataError("Failed to connect to room")
                        setIsLoading(false)
                    }
                } finally {
                    if (mounted && !dataError) setIsLoading(false)
                }
            }
        }

        initData()

        return () => {
            mounted = false;
            unsubscribeRef.current.forEach((unsubscribe) => unsubscribe())
            unsubscribeRef.current = []
        }
    }, [roomId, isSessionReady, setupRealtimeListeners])

    return {
        players,
        roomData,
        revealed,
        gameState,
        setGameState,
        currentRound,
        isLoading,
        atLeastOnePlayerVoted,
        isConnected,
        average,
        allVoted,
        getActivePlayersCount,
        getSpectatorsCount,
        getRoomLongId,
        scaleValues,
        dataError
    }
}
